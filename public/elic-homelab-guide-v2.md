# 🖥️ Elic Homelab Infrastructure Guide
## 5× HP EliteDesk 705 G4 — Full Proxmox Build From Scratch
### Step-by-Step Instructions for Claude Code

---

> **HOW CLAUDE CODE SHOULD USE THIS GUIDE**
> This file is written as direct instructions. Execute commands exactly as written.
> When you SSH into a node, you are on that specific machine — don't confuse IPs.
> Every section states which machine it runs on. Never skip a verification step.
> Passwords marked ← CHANGE THIS must be replaced before deploying that service.
> All Docker Compose blocks are complete files — create them exactly as shown.
> Domain: elic01.dev (registered on Cloudflare). All services use this domain.

---

## 📋 TABLE OF CONTENTS

| Phase | Section | Status |
|-------|---------|--------|
| 0 | [Hardware, Network & Domain Reference](#phase-0) | Start here |
| 1 | [Pre-Installation Prep](#phase-1) | Before touching hardware |
| 2 | [Proxmox VE Installation — All Nodes](#phase-2) | Physical install |
| 3 | [Post-Install Hardening — All Nodes](#phase-3) | SSH required |
| 4 | [Cluster Formation — Nodes 1–4](#phase-4) | After all PVE installs |
| 5 | [Ubuntu VM Template](#phase-5) | Run on Node1 |
| 6 | [Cloudflare & DNS Architecture](#phase-6) | Before any services start |
| 7 | [Node1 — Control Plane](#phase-7) | Traefik, Portainer, Grafana, Media |
| 8 | [Node2 — Cloud & Productivity](#phase-8) | Nextcloud, Immich, Git, Vault, etc. |
| 9 | [Node3 — Network & Security](#phase-9) | Technitium, VPN, Ad-blocking |
| 10 | [Node4 — AI & Development](#phase-10) | Ollama, n8n, Code Server |
| 11 | [Node5 — Backup Server](#phase-11) | Proxmox Backup Server |
| 12 | [Monitoring & Alerting](#phase-12) | Grafana dashboards |
| 13 | [Final Verification Checklist](#phase-13) | Full audit |
| 14 | [Service Reference Card](#phase-14) | Complete service map |

---

## Phase 0 — Hardware, Network & Domain Reference {#phase-0}

### Node Hardware Summary

| Node | Role | RAM | NVMe | HDD | IP |
|------|------|-----|------|-----|----|
| Node1 | Control Plane + Media | 32GB | 512GB | 1TB | 192.168.10.101 |
| Node2 | Cloud & Productivity | 32GB | 512GB | 1TB | 192.168.10.102 |
| Node3 | Network & Security | 16GB | 512GB | 1TB | 192.168.10.103 |
| Node4 | AI & Development | 16GB | 512GB | 1TB | 192.168.10.104 |
| Node5 | Backup (PBS) | 16GB | 512GB | 1TB | 192.168.10.105 |

**All nodes:** HP EliteDesk 705 G4 65W | CPU: AMD Ryzen 5 Pro 2400G (4C/8T @ 3.9GHz)
**GPU:** AMD Radeon RX Vega 11 (integrated — shared RAM, no discrete VRAM)
**Network:** 1× Intel I219-LM Gigabit NIC per node

### Network Addressing Scheme

```
LAN Subnet:       192.168.10.0/24
Router/Gateway:   192.168.10.1
PVE Hosts:        192.168.10.101–105  (static DHCP reservations on router)
VMs/Containers:   192.168.10.110–160  (static, set via cloud-init)
DHCP Dynamic:     192.168.10.200–250  (phones, laptops, other devices)
Cluster Name:     elic-homelab
Domain:           elic01.dev          (Cloudflare registrar)
Internal DNS:     Technitium on 192.168.10.130
```

### VM Assignment Table

| VMID | Hostname | IP | Node Host | RAM | Role |
|------|----------|----|-----------|-----|------|
| 101 | ctrl-node1 | 192.168.10.110 | Node1 | 16GB | Traefik, Portainer, Grafana, Media |
| 201 | cloud-node2 | 192.168.10.120 | Node2 | 12GB | Nextcloud AIO |
| 202 | apps-node2 | 192.168.10.121 | Node2 | 16GB | Immich, Gitea, Vault, all apps |
| 301 | net-node3 | 192.168.10.130 | Node3 | 8GB | Technitium DNS, AdGuard, WireGuard |
| 401 | ai-node4 | 192.168.10.140 | Node4 | 14GB | Ollama, n8n, Code Server, Dev tools |
| 501 | — | 192.168.10.105 | Node5 bare | 16GB | Proxmox Backup Server (bare metal) |

---

### Domain Architecture — Split-Horizon DNS

This setup uses **split-horizon DNS** with `elic01.dev` as the single domain for everything.

**How it works:**
- Traefik (on ctrl-node1) holds **one wildcard Let's Encrypt cert** for `*.elic01.dev`
- ALL services — internal and external — use `service.elic01.dev` subdomains
- **Public services** have Cloudflare A records → reachable from the internet
- **Internal services** have NO Cloudflare record → only exist in Technitium's local DNS
- Technitium (Node3) resolves ALL `elic01.dev` subdomains to LAN IPs for devices on the network
- Internal-only services also carry a Traefik IP-whitelist middleware as an extra layer

**What this gives you:**
- Valid HTTPS (green padlock, no browser warnings) on every single service
- No `homelab.local` or self-signed certs anywhere
- Public services work from phone on mobile data
- Internal services 404 from the internet (no DNS record = no connection)
- One cert, one Traefik, one domain to remember

```
┌─────────────────────────────────────────────────────────┐
│                    elic01.dev                           │
├──────────────────────┬──────────────────────────────────┤
│  PUBLIC (Cloudflare  │  INTERNAL (Technitium only,      │
│  A record exists)    │  no Cloudflare record)           │
├──────────────────────┼──────────────────────────────────┤
│ vault.elic01.dev     │ home.elic01.dev                  │
│ cloud.elic01.dev     │ portainer.elic01.dev             │
│ photos.elic01.dev    │ grafana.elic01.dev               │
│ git.elic01.dev       │ prometheus.elic01.dev            │
│ tv.elic01.dev        │ uptime.elic01.dev                │
│ music.elic01.dev     │ alerts.elic01.dev                │
│ books.elic01.dev     │ docs.elic01.dev                  │
│ ai.elic01.dev        │ pdf.elic01.dev                   │
│                      │ tools.elic01.dev                 │
│                      │ wiki.elic01.dev                  │
│                      │ tasks.elic01.dev                 │
│                      │ rss.elic01.dev                   │
│                      │ notes.elic01.dev                 │
│                      │ nocodb.elic01.dev                │
│                      │ whiteboard.elic01.dev            │
│                      │ grammar.elic01.dev               │
│                      │ read.elic01.dev                  │
│                      │ dns.elic01.dev                   │
│                      │ adguard.elic01.dev               │
│                      │ speedtest.elic01.dev             │
│                      │ vpn.elic01.dev                   │
│                      │ n8n.elic01.dev                   │
│                      │ flow.elic01.dev                  │
│                      │ code.elic01.dev                  │
│                      │ lab.elic01.dev                   │
│                      │ search.elic01.dev                │
│                      │ api.elic01.dev                   │
│                      │ analytics.elic01.dev             │
│                      │ pbs.elic01.dev                   │
│                      │ sonarr.elic01.dev                │
│                      │ radarr.elic01.dev                │
│                      │ prowlarr.elic01.dev              │
│                      │ torrent.elic01.dev               │
└──────────────────────┴──────────────────────────────────┘
All resolve via Traefik on 192.168.10.110 → valid *.elic01.dev cert
```

### Complete Service → URL Map

```
# ══ NODE 1 — CONTROL PLANE (192.168.10.110) ══════════════════════════

home.elic01.dev         → Homepage dashboard         [INTERNAL]
portainer.elic01.dev    → Portainer (Docker UI)      [INTERNAL]
grafana.elic01.dev      → Grafana dashboards          [INTERNAL]
prometheus.elic01.dev   → Prometheus metrics          [INTERNAL]
uptime.elic01.dev       → Uptime Kuma monitoring      [INTERNAL]
alerts.elic01.dev       → ntfy push notifications     [INTERNAL]
tv.elic01.dev           → Jellyfin media server       [PUBLIC]
music.elic01.dev        → Navidrome music streaming   [PUBLIC]
books.elic01.dev        → Audiobookshelf              [PUBLIC]
sonarr.elic01.dev       → Sonarr TV automation        [INTERNAL]
radarr.elic01.dev       → Radarr movie automation     [INTERNAL]
prowlarr.elic01.dev     → Prowlarr indexer manager    [INTERNAL]
torrent.elic01.dev      → qBittorrent client          [INTERNAL]

# ══ NODE 2 — CLOUD (192.168.10.120) ══════════════════════════════════

cloud.elic01.dev        → Nextcloud (Drive+Docs+Cal)  [PUBLIC]

# ══ NODE 2 — APPS (192.168.10.121) ═══════════════════════════════════

photos.elic01.dev       → Immich (Google Photos)      [PUBLIC]
git.elic01.dev          → Gitea (GitHub)              [PUBLIC]
vault.elic01.dev        → Vaultwarden (1Password)     [PUBLIC]
docs.elic01.dev         → Paperless-NGX               [INTERNAL]
pdf.elic01.dev          → Stirling-PDF                [INTERNAL]
tools.elic01.dev        → IT-Tools                    [INTERNAL]
wiki.elic01.dev         → Outline (Notion)            [INTERNAL]
tasks.elic01.dev        → Vikunja (Todoist/Trello)    [INTERNAL]
rss.elic01.dev          → FreshRSS (Feedly)           [INTERNAL]
notes.elic01.dev        → Memos (Google Keep)         [INTERNAL]
nocodb.elic01.dev       → NocoDB (Airtable)           [INTERNAL]
whiteboard.elic01.dev   → Excalidraw                  [INTERNAL]
grammar.elic01.dev      → LanguageTool (Grammarly)    [INTERNAL]
read.elic01.dev         → Wallabag (Pocket)           [INTERNAL]

# ══ NODE 3 — NETWORK (192.168.10.130) ════════════════════════════════

dns.elic01.dev          → Technitium DNS Web UI       [INTERNAL]
adguard.elic01.dev      → AdGuard Home                [INTERNAL]
speedtest.elic01.dev    → Speedtest Tracker           [INTERNAL]
vpn.elic01.dev          → WireGuard UI                [INTERNAL]

# ══ NODE 4 — AI & DEV (192.168.10.140) ═══════════════════════════════

ai.elic01.dev           → OpenWebUI + Ollama (AI)     [PUBLIC]
n8n.elic01.dev          → n8n automation              [INTERNAL]
flow.elic01.dev         → Flowise AI builder          [INTERNAL]
code.elic01.dev         → Code Server (VS Code)       [INTERNAL]
lab.elic01.dev          → JupyterLab                  [INTERNAL]
search.elic01.dev       → SearXNG private search      [INTERNAL]
api.elic01.dev          → Hoppscotch (Postman)        [INTERNAL]
analytics.elic01.dev    → Plausible Analytics         [INTERNAL]

# ══ NODE 5 — BACKUP (192.168.10.105) ═════════════════════════════════

pbs.elic01.dev          → Proxmox Backup Server       [INTERNAL]
```

### Cost Savings Summary

| Paid Service | Monthly Cost | Replacement | URL |
|---|---|---|---|
| Google One 2TB | ~$10 | Nextcloud | cloud.elic01.dev |
| Google Photos | ~$3 | Immich | photos.elic01.dev |
| 1Password | ~$5 | Vaultwarden | vault.elic01.dev |
| GitHub private | ~$4 | Gitea | git.elic01.dev |
| Notion Pro | ~$8 | Outline + Vikunja | wiki.elic01.dev |
| ChatGPT Plus | ~$20 | OpenWebUI + Ollama | ai.elic01.dev |
| Zapier/Make | ~$20 | n8n | n8n.elic01.dev |
| Netflix | ~$15 | Jellyfin | tv.elic01.dev |
| Spotify | ~$10 | Navidrome | music.elic01.dev |
| Adobe Acrobat | ~$15 | Stirling-PDF | pdf.elic01.dev |
| Grammarly | ~$12 | LanguageTool | grammar.elic01.dev |
| Google Analytics | ~$0+ | Plausible | analytics.elic01.dev |
| **TOTAL** | **~$122/month** | **$0/month** | elic01.dev |

---

## Phase 1 — Pre-Installation Prep {#phase-1}

### 1.1 Gather Required Items

```
[ ] 2× USB drives (≥8GB each)
    - 1× for Proxmox VE ISO (Nodes 1–4)
    - 1× for Proxmox Backup Server ISO (Node5 only)
[ ] Monitor with HDMI + USB keyboard (shared between nodes during install)
[ ] Network switch (6+ ports: 5 nodes + router uplink)
[ ] 5× ethernet cables
[ ] Access to your home router's admin panel
[ ] Laptop/PC to download ISOs
[ ] Cloudflare account with elic01.dev registered ← already done
```

### 1.2 Download ISOs

```bash
mkdir ~/homelab-isos && cd ~/homelab-isos

# Proxmox VE (latest 8.x — check proxmox.com/en/downloads for current version)
wget "https://enterprise.proxmox.com/iso/proxmox-ve_8.3-1.iso"

# Proxmox Backup Server (for Node5 only)
wget "https://enterprise.proxmox.com/iso/proxmox-backup-server_3.3-1.iso"
```

### 1.3 Flash USB Drives

**Linux/macOS:**

```bash
lsblk   # identify your USB devices

# Proxmox VE USB (for Nodes 1–4)
sudo dd if=proxmox-ve_8.3-1.iso of=/dev/sdX bs=4M status=progress conv=fdatasync

# PBS USB (for Node5 — use a second USB drive)
sudo dd if=proxmox-backup-server_3.3-1.iso of=/dev/sdY bs=4M status=progress conv=fdatasync
```

**Windows:** Use Rufus (rufus.ie) or Balena Etcher. Select ISO → select USB → Flash.

### 1.4 Router DHCP Reservations

Find each HP EliteDesk MAC address: boot node → F10 (BIOS) → Network Config → note MAC.
Or check the sticker on the underside of each unit.

In your router's admin panel, add static DHCP leases:

```
node1-pve   [node1 ethernet MAC]   192.168.10.101
node2-pve   [node2 ethernet MAC]   192.168.10.102
node3-pve   [node3 ethernet MAC]   192.168.10.103
node4-pve   [node4 ethernet MAC]   192.168.10.104
node5-pbs   [node5 ethernet MAC]   192.168.10.105
```

Keep your router's current DNS for now — update to Technitium after Phase 9.

### 1.5 Router Port Forwards (Do This Now)

Add these port forward rules in your router's admin panel.
Both forward to `192.168.10.110` (ctrl-node1, where Traefik will live).

```
Rule 1: TCP  80  → 192.168.10.110   (HTTP → Traefik, auto-redirects to HTTPS)
Rule 2: TCP  443 → 192.168.10.110   (HTTPS → Traefik)
Rule 3: UDP  51820 → 192.168.10.130 (WireGuard VPN, added after Phase 9)
```

---

## Phase 2 — Proxmox VE Installation (Nodes 1–4) {#phase-2}

**Run for Nodes 1, 2, 3, 4 only. Node5 uses the PBS ISO — see Phase 11.**

### 2.1 HP EliteDesk BIOS Settings

Power on, press **F10** immediately at the HP logo to enter BIOS.

```
Advanced → System Configuration
  └── Virtualization Technology (AMD-V): ENABLED    ← Required for VMs
  └── AMD IOMMU: ENABLED                            ← Required for device passthrough

Security → Secure Boot Configuration
  └── Secure Boot: DISABLED                         ← Proxmox won't boot with this on

Advanced → Boot Options
  └── Fast Boot: DISABLED
  └── USB Storage Boot: ENABLED
  └── UEFI Boot Order: USB first, NVMe second

Power → S5 Maximum Power Savings: DISABLED
```

F10 to save and exit.

### 2.2 Install Proxmox VE

Boot from PVE USB. Select **"Install Proxmox VE (Graphical)"**.

| Field | Node1 | Node2 | Node3 | Node4 |
|-------|-------|-------|-------|-------|
| Target Harddisk | 512GB NVMe | 512GB NVMe | 512GB NVMe | 512GB NVMe |
| Filesystem | ext4 | ext4 | ext4 | ext4 |
| Hostname (FQDN) | node1-pve.elic01.dev | node2-pve.elic01.dev | node3-pve.elic01.dev | node4-pve.elic01.dev |
| IP Address | 192.168.10.101 | 192.168.10.102 | 192.168.10.103 | 192.168.10.104 |
| Netmask | 255.255.255.0 | 255.255.255.0 | 255.255.255.0 | 255.255.255.0 |
| Gateway | 192.168.10.1 | 192.168.10.1 | 192.168.10.1 | 192.168.10.1 |
| DNS Server | 1.1.1.1 | 1.1.1.1 | 1.1.1.1 | 1.1.1.1 |

```
Country:    Zimbabwe
Timezone:   Africa/Harare
Keyboard:   English (US)
Password:   [strong root password — same on all nodes]
Email:      your@email.com
```

> **CRITICAL:** Select the 512GB NVMe as target. NOT the 1TB HDD.

Click Install. Machine reboots automatically (~5–10 min). Remove USB after reboot begins.

### 2.3 Verify All Nodes Are Up

From your laptop:

```bash
ssh root@192.168.10.101   # Node1
ssh root@192.168.10.102   # Node2
ssh root@192.168.10.103   # Node3
ssh root@192.168.10.104   # Node4
# All must respond before moving to Phase 3

# Also verify web UIs load (accept self-signed cert warning):
# https://192.168.10.101:8006
# https://192.168.10.102:8006
# https://192.168.10.103:8006
# https://192.168.10.104:8006
```

---

## Phase 3 — Post-Install Hardening (ALL PVE Nodes) {#phase-3}

**Run every command block on ALL FOUR nodes: 101, 102, 103, 104.**
**Open 4 terminal tabs and SSH into each simultaneously.**

### 3.1 Fix Repositories (Remove Paid Subscription Requirement)

```bash
# Disable enterprise repos
sed -i 's/^deb/#deb/g' /etc/apt/sources.list.d/pve-enterprise.list
[ -f /etc/apt/sources.list.d/ceph.list ] && \
  sed -i 's/^deb/#deb/g' /etc/apt/sources.list.d/ceph.list

# Add free community repos
cat > /etc/apt/sources.list.d/pve-no-subscription.list << 'EOF'
deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription
EOF

cat > /etc/apt/sources.list.d/ceph-no-subscription.list << 'EOF'
deb http://download.proxmox.com/debian/ceph-reef bookworm no-subscription
EOF

# Standard Debian Bookworm
cat > /etc/apt/sources.list << 'EOF'
deb http://ftp.debian.org/debian bookworm main contrib non-free non-free-firmware
deb http://ftp.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
deb http://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
EOF
```

### 3.2 Remove Subscription Nag Popup

```bash
sed -Ezi.bak \
  "s/(Ext.Msg.show\(\{[^}]+title: gettext\('No valid sub)/void\(\{ \/\/\1/g" \
  /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js

systemctl restart pveproxy
```

### 3.3 Full System Update

```bash
apt update && apt full-upgrade -y && apt autoremove -y && apt autoclean
```

### 3.4 Install Essential Tools

```bash
apt install -y \
  curl wget git vim nano tmux \
  htop iotop iftop nethogs \
  net-tools nmap \
  unzip zip \
  fail2ban \
  lm-sensors smartmontools \
  nfs-kernel-server nfs-common \
  open-iscsi
```

### 3.5 Configure Fail2Ban

```bash
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled  = true
port     = ssh
logpath  = %(sshd_log)s
backend  = %(syslog_backend)s

[proxmox]
enabled  = true
port     = https,http,8006
filter   = proxmox
logpath  = /var/log/daemon.log
maxretry = 3
bantime  = 3600
EOF

cat > /etc/fail2ban/filter.d/proxmox.conf << 'EOF'
[Definition]
failregex = pvedaemon\[.*authentication failure; rhost=<HOST> user=.* msg=.*
ignoreregex =
EOF

systemctl enable --now fail2ban
```

### 3.6 Enable AMD IOMMU

```bash
sed -i \
  's/GRUB_CMDLINE_LINUX_DEFAULT="quiet"/GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on iommu=pt"/' \
  /etc/default/grub

update-grub

cat >> /etc/modules << 'EOF'
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
EOF
```

### 3.7 Configure HDD Storage (1TB Data Drive)

```bash
# Find the 1TB HDD — will be /dev/sda. NVMe is /dev/nvme0n1 (system disk — DO NOT TOUCH)
lsblk

# Verify it's the HDD
fdisk -l /dev/sda | head -3
# Should show ~1TB

# Partition, format, mount
parted /dev/sda --script mklabel gpt
parted /dev/sda --script mkpart primary ext4 0% 100%
mkfs.ext4 -F /dev/sda1 -L hdd-data

HDD_UUID=$(blkid /dev/sda1 -s UUID -o value)
mkdir -p /mnt/hdd-data
echo "UUID=$HDD_UUID /mnt/hdd-data ext4 defaults 0 2" >> /etc/fstab
mount -a

# Verify
df -h /mnt/hdd-data   # Should show ~1TB available

# Register with Proxmox storage manager
pvesm add dir hdd-data \
  --path /mnt/hdd-data \
  --content vztmpl,iso,backup,snippets,rootdir,images
```

### 3.8 NFS Export — Node1 Only

**Run this block ONLY on Node1 (192.168.10.101).** This shares Node1's HDD
with the ctrl VM so all media services can use the full 1TB drive.

```bash
# Create directory structure
mkdir -p /mnt/hdd-data/media/{movies,tv,music,books,ebooks,photos}
mkdir -p /mnt/hdd-data/downloads/{complete,incomplete}
mkdir -p /mnt/hdd-data/appdata

# Export to LAN
cat >> /etc/exports << 'EOF'
/mnt/hdd-data 192.168.10.0/24(rw,sync,no_subtree_check,no_root_squash)
EOF

exportfs -ra
systemctl enable --now nfs-kernel-server
showmount -e localhost   # Should print: /mnt/hdd-data 192.168.10.0/24
```

### 3.9 Reboot All Nodes

```bash
reboot
```

After reboot, verify on each node:

```bash
dmesg | grep -i iommu | head -5   # Should show: AMD-Vi: IOMMU enabled
pvesm status                       # Should show local-lvm and hdd-data
systemctl status fail2ban --no-pager
```

---

## Phase 4 — Cluster Formation (Nodes 1–4) {#phase-4}

**Node5 is NOT part of this cluster — it runs PBS standalone.**

### 4.1 Create Cluster on Node1

```bash
ssh root@192.168.10.101

pvecm create elic-homelab

# Verify
pvecm status
```

Expected:
```
Name:             elic-homelab
Config Version:   1
Transport:        knet
Secure auth:      on
```

### 4.2 Join Remaining Nodes

```bash
# Node2
ssh root@192.168.10.102
pvecm add 192.168.10.101   # enter Node1 root password when prompted

# Node3
ssh root@192.168.10.103
pvecm add 192.168.10.101

# Node4
ssh root@192.168.10.104
pvecm add 192.168.10.101
```

### 4.3 Verify Full Cluster

```bash
ssh root@192.168.10.101
pvecm nodes
```

Must show all 4 nodes online:

```
Membership information
----------------------
    Nodeid  Votes Name
         1      1 node1-pve (local)
         2      1 node2-pve
         3      1 node3-pve
         4      1 node4-pve
```

> **QUORUM:** 4-node cluster needs 3 online to function.
> If 1 node goes offline for maintenance: `pvecm expected 3`
> Restore when all back: `pvecm expected 4`

---

## Phase 5 — Ubuntu VM Template {#phase-5}

**Run on Node1 only.**

### 5.1 Download Ubuntu 24.04 Cloud Image

```bash
ssh root@192.168.10.101

wget \
  https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img \
  -O /var/lib/vz/template/qemu/ubuntu-24.04-cloud.img

ls -lh /var/lib/vz/template/qemu/ubuntu-24.04-cloud.img
# Should show ~600MB
```

### 5.2 Create Template VM

```bash
qm create 9000 \
  --name ubuntu-24.04-template \
  --memory 2048 \
  --balloon 0 \
  --cores 2 \
  --net0 virtio,bridge=vmbr0 \
  --ostype l26 \
  --agent enabled=1 \
  --machine q35 \
  --bios ovmf

qm importdisk 9000 \
  /var/lib/vz/template/qemu/ubuntu-24.04-cloud.img \
  local-lvm

qm set 9000 \
  --scsihw virtio-scsi-pci \
  --scsi0 local-lvm:vm-9000-disk-0,discard=on,ssd=1

qm set 9000 --ide2 local-lvm:cloudinit
qm set 9000 --efidisk0 local-lvm:0,efitype=4m,pre-enrolled-keys=0
qm set 9000 --boot order=scsi0
qm set 9000 --serial0 socket --vga serial0

qm set 9000 \
  --ciuser ubuntu \
  --cipassword 'HomeLab@ZW2025!'   # ← CHANGE THIS
  --ipconfig0 ip=dhcp

qm resize 9000 scsi0 30G
qm template 9000

echo "Template VMID 9000 ready."
```

### 5.3 Cloud-Init Base Config

```bash
mkdir -p /var/lib/vz/snippets

cat > /var/lib/vz/snippets/cloud-init-base.yml << 'EOF'
#cloud-config
package_update: true
package_upgrade: true
packages:
  - qemu-guest-agent
  - curl
  - wget
  - vim
  - htop
  - net-tools
  - nfs-common
runcmd:
  - systemctl enable --now qemu-guest-agent
  - curl -fsSL https://get.docker.com | sh
  - usermod -aG docker ubuntu
  - apt install -y docker-compose-plugin
EOF
```

### 5.4 VM Deploy Helper

```bash
cat > /usr/local/bin/deploy-vm << 'SCRIPT'
#!/bin/bash
# Usage: deploy-vm <VMID> <name> <ip> <cores> <ram_MB> <disk_GB>

VMID=$1; NAME=$2; IP=$3; CORES=$4; RAM=$5; DISK=$6
[ -z "$6" ] && { echo "Usage: deploy-vm VMID name ip cores ram_MB disk_GB"; exit 1; }

echo "Deploying VM $VMID ($NAME) at $IP..."

qm clone 9000 $VMID --name $NAME --full true --storage local-lvm

qm set $VMID \
  --memory $RAM \
  --balloon 0 \
  --cores $CORES \
  --ipconfig0 "ip=${IP}/24,gw=192.168.10.1" \
  --nameserver "192.168.10.130" \
  --searchdomain "elic01.dev" \
  --cicustom "user=local:snippets/cloud-init-base.yml"

qm resize $VMID scsi0 ${DISK}G
qm start $VMID

echo "VM $VMID started. Wait ~90 seconds, then: ssh ubuntu@$IP"
SCRIPT

chmod +x /usr/local/bin/deploy-vm
```

---

## Phase 6 — Cloudflare & DNS Architecture {#phase-6}

**Complete this phase BEFORE deploying any services. It sets up the foundation
that gives every service a valid HTTPS cert.**

### 6.1 Cloudflare API Token

In Cloudflare dashboard:
- My Profile → **API Tokens** → Create Token
- Template: **"Edit zone DNS"**
- Zone Resources: `Include → Specific zone → elic01.dev`
- Create Token → **copy it now (shown once)**

### 6.2 Cloudflare DNS Records (Public Services Only)

In Cloudflare dashboard → elic01.dev → **DNS** → Add these records.

**Proxy status = OFF (DNS only / grey cloud) for ALL entries.**
Traefik handles TLS — Cloudflare proxy would interfere.

```
Type  Name       Content             Proxy
──────────────────────────────────────────────────────────
A     vault      [your home public IP]  DNS only
A     cloud      [your home public IP]  DNS only
A     photos     [your home public IP]  DNS only
A     git        [your home public IP]  DNS only
A     tv         [your home public IP]  DNS only
A     music      [your home public IP]  DNS only
A     books      [your home public IP]  DNS only
A     ai         [your home public IP]  DNS only
```

> **Find your home public IP:** `curl ifconfig.me`
>
> **Do NOT add records for any internal service.** If no Cloudflare A record exists,
> the domain resolves nowhere from the internet. Technitium on your LAN resolves
> them internally. This is your security boundary.

### 6.3 Technitium DNS — elic01.dev Zone (Internal Resolution)

This is configured in Phase 9 when Technitium is deployed. For reference, here is
every A record you'll create in Technitium's `elic01.dev` zone.

**All services point to their VM's direct IP** (Technitium → LAN IP → Traefik routes):

```
# Traefik lives on ctrl-node1 (192.168.10.110)
# Public services also get Cloudflare records (above)

home             → 192.168.10.110
portainer        → 192.168.10.110
grafana          → 192.168.10.110
prometheus       → 192.168.10.110
uptime           → 192.168.10.110
alerts           → 192.168.10.110
tv               → 192.168.10.110
music            → 192.168.10.110
books            → 192.168.10.110
sonarr           → 192.168.10.110
radarr           → 192.168.10.110
prowlarr         → 192.168.10.110
torrent          → 192.168.10.110
cloud            → 192.168.10.110   (Traefik proxies to 192.168.10.120)
photos           → 192.168.10.110   (Traefik proxies to 192.168.10.121)
git              → 192.168.10.110
vault            → 192.168.10.110
docs             → 192.168.10.110
pdf              → 192.168.10.110
tools            → 192.168.10.110
wiki             → 192.168.10.110
tasks            → 192.168.10.110
rss              → 192.168.10.110
notes            → 192.168.10.110
nocodb           → 192.168.10.110
whiteboard       → 192.168.10.110
grammar          → 192.168.10.110
read             → 192.168.10.110
dns              → 192.168.10.130   (direct to Technitium VM)
adguard          → 192.168.10.110
speedtest        → 192.168.10.110
vpn              → 192.168.10.110
ai               → 192.168.10.110
n8n              → 192.168.10.110
flow             → 192.168.10.110
code             → 192.168.10.110
lab              → 192.168.10.110
search           → 192.168.10.110
api              → 192.168.10.110
analytics        → 192.168.10.110
pbs              → 192.168.10.105   (direct to PBS node)

# Infrastructure nodes
node1-pve        → 192.168.10.101
node2-pve        → 192.168.10.102
node3-pve        → 192.168.10.103
node4-pve        → 192.168.10.104
node5-pbs        → 192.168.10.105
ctrl-node1       → 192.168.10.110
cloud-node2      → 192.168.10.120
apps-node2       → 192.168.10.121
net-node3        → 192.168.10.130
ai-node4         → 192.168.10.140
```

---

## Phase 7 — Node1: Control Plane {#phase-7}

**Node1 (192.168.10.101) → VM ctrl-node1 (192.168.10.110)**
**Runs: Traefik, Portainer, Prometheus, Grafana, Uptime Kuma, Homepage, ntfy,**
**Watchtower, Jellyfin, Navidrome, Audiobookshelf, full *arr stack**

### 7.1 Deploy ctrl-node1 VM

```bash
ssh root@192.168.10.101

deploy-vm 101 ctrl-node1 192.168.10.110 4 16384 60
```

Wait ~90 seconds for cloud-init to complete:

```bash
ssh ubuntu@192.168.10.110
```

### 7.2 Initial VM Setup

```bash
# Verify Docker installed by cloud-init
docker --version
docker compose version

# Mount NFS from Node1 PVE host (media storage)
sudo mkdir -p /mnt/media
echo "192.168.10.101:/mnt/hdd-data /mnt/media nfs rw,sync,hard,intr 0 0" \
  | sudo tee -a /etc/fstab
sudo mount -a

# Verify NFS mount
ls /mnt/media
# Must show: appdata  downloads  media

# Create all directory structures upfront
sudo mkdir -p /opt/docker/{traefik,portainer,monitoring,homepage,uptime-kuma,watchtower,ntfy,jellyfin,navidrome,audiobookshelf,arr-stack}
sudo mkdir -p /opt/appdata/{traefik/config/dynamic,traefik/letsencrypt,traefik/logs,portainer,prometheus,grafana,uptime-kuma,ntfy/cache,ntfy/data,jellyfin/config,jellyfin/cache,navidrome,audiobookshelf/config,audiobookshelf/metadata,prowlarr,sonarr,radarr,bazarr,qbittorrent}
sudo chown -R ubuntu:ubuntu /opt/docker /opt/appdata

# Create the proxy network that ALL containers join
docker network create proxy

echo "ctrl-node1 setup complete."
```

### 7.3 Traefik — Reverse Proxy + SSL

Traefik is the single entry point for all traffic. It gets the wildcard cert for
`*.elic01.dev` via Cloudflare DNS-01 challenge. All services use this one cert.

**Create Traefik static config:**

```bash
cat > /opt/appdata/traefik/traefik.yml << 'EOF'
# Traefik v3 — Static Configuration
global:
  checkNewVersion: false
  sendAnonymousUsage: false

log:
  level: INFO
  filePath: /logs/traefik.log

accessLog:
  filePath: /logs/access.log
  bufferingSize: 100

api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true

  websecure:
    address: ":443"
    http:
      tls:
        certResolver: cloudflare
        domains:
          - main: "elic01.dev"
            sans:
              - "*.elic01.dev"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: proxy
  file:
    directory: /config/dynamic
    watch: true

# Cloudflare DNS-01 challenge for Let's Encrypt wildcard cert
certificatesResolvers:
  cloudflare:
    acme:
      email: "your@email.com"             # ← CHANGE THIS
      storage: /letsencrypt/acme.json
      dnsChallenge:
        provider: cloudflare
        resolvers:
          - "1.1.1.1:53"
          - "8.8.8.8:53"
EOF
```

**Create middleware config (security headers + IP whitelist for internal services):**

```bash
cat > /opt/appdata/traefik/config/dynamic/middlewares.yml << 'EOF'
http:
  middlewares:
    # Applied to ALL services
    default-headers:
      headers:
        frameDeny: true
        browserXssFilter: true
        contentTypeNosniff: true
        forceSTSHeader: true
        stsIncludeSubdomains: true
        stsPreload: true
        stsSeconds: 31536000
        referrerPolicy: "strict-origin-when-cross-origin"

    # Applied to INTERNAL-ONLY services
    # Blocks anyone not on LAN, WireGuard VPN, or Tailscale
    internal-only:
      ipWhiteList:
        sourceRange:
          - "192.168.10.0/24"   # LAN
          - "10.8.0.0/24"       # WireGuard VPN clients
          - "100.64.0.0/10"     # Tailscale mesh VPN
          - "127.0.0.1/32"      # Localhost

    # Middleware chain for internal services
    internal-secured:
      chain:
        middlewares:
          - default-headers
          - internal-only
EOF
```

**Create Traefik `.env` file (keep this secure):**

```bash
cat > /opt/docker/traefik/.env << 'EOF'
CF_API_EMAIL=your@email.com                        # ← CHANGE THIS
CF_DNS_API_TOKEN=your_cloudflare_api_token         # ← CHANGE THIS (from Phase 6.1)
EOF
chmod 600 /opt/docker/traefik/.env
```

**Create `docker-compose.yml` for Traefik:**

```bash
cat > /opt/docker/traefik/docker-compose.yml << 'EOF'
services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    ports:
      - "80:80"
      - "443:443"
    env_file: .env
    environment:
      - CF_API_EMAIL=${CF_API_EMAIL}
      - CF_DNS_API_TOKEN=${CF_DNS_API_TOKEN}
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /opt/appdata/traefik/traefik.yml:/traefik.yml:ro
      - /opt/appdata/traefik/config:/config:ro
      - /opt/appdata/traefik/letsencrypt:/letsencrypt
      - /opt/appdata/traefik/logs:/logs
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik-dash.rule=Host(`portal.elic01.dev`)"
      - "traefik.http.routers.traefik-dash.entrypoints=websecure"
      - "traefik.http.routers.traefik-dash.tls=true"
      - "traefik.http.routers.traefik-dash.tls.certresolver=cloudflare"
      - "traefik.http.routers.traefik-dash.service=api@internal"
      - "traefik.http.routers.traefik-dash.middlewares=internal-secured@file"

networks:
  proxy:
    external: true
EOF

# Prepare acme.json
touch /opt/appdata/traefik/letsencrypt/acme.json
chmod 600 /opt/appdata/traefik/letsencrypt/acme.json

# Start Traefik
cd /opt/docker/traefik && docker compose up -d

# Watch for cert issuance (takes 1–2 minutes on first run)
sleep 5
docker compose logs -f traefik | grep -i "cert\|acme\|error\|obtained"
# Press Ctrl+C when you see: "Obtained certificate" for *.elic01.dev
```

**Static route config for services on other nodes** — these are Traefik file-provider
routes for VMs that don't run on ctrl-node1. Create them all now so they're ready:

```bash
# Node2 services (apps-node2: 192.168.10.121 and cloud-node2: 192.168.10.120)
cat > /opt/appdata/traefik/config/dynamic/node2-routes.yml << 'EOF'
http:
  routers:
    # ── PUBLIC ──────────────────────────────────────────────────────
    cloud:
      rule: "Host(`cloud.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: nextcloud
      middlewares: [default-headers@file]

    photos:
      rule: "Host(`photos.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: immich
      middlewares: [default-headers@file]

    git:
      rule: "Host(`git.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: gitea
      middlewares: [default-headers@file]

    vault:
      rule: "Host(`vault.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: vaultwarden
      middlewares: [default-headers@file]

    # ── INTERNAL ─────────────────────────────────────────────────────
    docs:
      rule: "Host(`docs.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: paperless
      middlewares: [internal-secured@file]

    pdf:
      rule: "Host(`pdf.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: stirling
      middlewares: [internal-secured@file]

    tools:
      rule: "Host(`tools.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: it-tools
      middlewares: [internal-secured@file]

    wiki:
      rule: "Host(`wiki.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: outline
      middlewares: [internal-secured@file]

    tasks:
      rule: "Host(`tasks.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: vikunja
      middlewares: [internal-secured@file]

    rss:
      rule: "Host(`rss.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: freshrss
      middlewares: [internal-secured@file]

    notes:
      rule: "Host(`notes.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: memos
      middlewares: [internal-secured@file]

    nocodb:
      rule: "Host(`nocodb.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: nocodb
      middlewares: [internal-secured@file]

    whiteboard:
      rule: "Host(`whiteboard.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: excalidraw
      middlewares: [internal-secured@file]

    grammar:
      rule: "Host(`grammar.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: languagetool
      middlewares: [internal-secured@file]

    read:
      rule: "Host(`read.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: wallabag
      middlewares: [internal-secured@file]

  services:
    nextcloud:
      loadBalancer:
        servers: [{url: "http://192.168.10.120:11000"}]
    immich:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:2283"}]
    gitea:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:3000"}]
    vaultwarden:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:8222"}]
    paperless:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:8000"}]
    stirling:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:8080"}]
    it-tools:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:8181"}]
    outline:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:3010"}]
    vikunja:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:3456"}]
    freshrss:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:8082"}]
    memos:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:5230"}]
    nocodb:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:8888"}]
    excalidraw:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:8383"}]
    languagetool:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:8010"}]
    wallabag:
      loadBalancer:
        servers: [{url: "http://192.168.10.121:8083"}]
EOF

# Node3 services (net-node3: 192.168.10.130)
cat > /opt/appdata/traefik/config/dynamic/node3-routes.yml << 'EOF'
http:
  routers:
    adguard:
      rule: "Host(`adguard.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: adguard
      middlewares: [internal-secured@file]

    speedtest:
      rule: "Host(`speedtest.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: speedtest
      middlewares: [internal-secured@file]

    vpn:
      rule: "Host(`vpn.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: wireguard-ui
      middlewares: [internal-secured@file]

  services:
    adguard:
      loadBalancer:
        servers: [{url: "http://192.168.10.130:3001"}]
    speedtest:
      loadBalancer:
        servers: [{url: "http://192.168.10.130:8082"}]
    wireguard-ui:
      loadBalancer:
        servers: [{url: "http://192.168.10.130:51821"}]
EOF

# Node4 services (ai-node4: 192.168.10.140)
cat > /opt/appdata/traefik/config/dynamic/node4-routes.yml << 'EOF'
http:
  routers:
    # ── PUBLIC ──────────────────────────────────────────────────────
    openwebui:
      rule: "Host(`ai.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: openwebui
      middlewares: [default-headers@file]

    # ── INTERNAL ─────────────────────────────────────────────────────
    n8n:
      rule: "Host(`n8n.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: n8n
      middlewares: [internal-secured@file]

    flowise:
      rule: "Host(`flow.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: flowise
      middlewares: [internal-secured@file]

    code-server:
      rule: "Host(`code.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: code-server
      middlewares: [internal-secured@file]

    jupyter:
      rule: "Host(`lab.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: jupyter
      middlewares: [internal-secured@file]

    searxng:
      rule: "Host(`search.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: searxng
      middlewares: [internal-secured@file]

    hoppscotch:
      rule: "Host(`api.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: hoppscotch
      middlewares: [internal-secured@file]

    plausible:
      rule: "Host(`analytics.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: plausible
      middlewares: [internal-secured@file]

  services:
    openwebui:
      loadBalancer:
        servers: [{url: "http://192.168.10.140:3000"}]
    n8n:
      loadBalancer:
        servers: [{url: "http://192.168.10.140:5678"}]
    flowise:
      loadBalancer:
        servers: [{url: "http://192.168.10.140:3001"}]
    code-server:
      loadBalancer:
        servers: [{url: "http://192.168.10.140:8080"}]
    jupyter:
      loadBalancer:
        servers: [{url: "http://192.168.10.140:8888"}]
    searxng:
      loadBalancer:
        servers: [{url: "http://192.168.10.140:8099"}]
    hoppscotch:
      loadBalancer:
        servers: [{url: "http://192.168.10.140:3002"}]
    plausible:
      loadBalancer:
        servers: [{url: "http://192.168.10.140:8000"}]
EOF

# Node5 PBS route
cat > /opt/appdata/traefik/config/dynamic/node5-routes.yml << 'EOF'
http:
  routers:
    pbs:
      rule: "Host(`pbs.elic01.dev`)"
      entrypoints: [websecure]
      tls:
        certResolver: cloudflare
      service: pbs
      middlewares: [internal-secured@file]

  services:
    pbs:
      loadBalancer:
        servers: [{url: "https://192.168.10.105:8007"}]
        serversTransport: skip-verify

  serversTransports:
    skip-verify:
      insecureSkipVerify: true   # PBS uses its own self-signed cert internally
EOF

echo "All static routes created. Traefik will pick them up automatically."
```

### 7.4 Portainer — Container Management

```bash
cat > /opt/docker/portainer/docker-compose.yml << 'EOF'
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /opt/appdata/portainer:/data
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portainer.rule=Host(`portainer.elic01.dev`)"
      - "traefik.http.routers.portainer.entrypoints=websecure"
      - "traefik.http.routers.portainer.tls=true"
      - "traefik.http.routers.portainer.tls.certresolver=cloudflare"
      - "traefik.http.routers.portainer.middlewares=internal-secured@file"
      - "traefik.http.services.portainer.loadbalancer.server.port=9000"

networks:
  proxy:
    external: true
EOF

cd /opt/docker/portainer && docker compose up -d
```

Open `https://portainer.elic01.dev` and create your admin account within 5 minutes.

### 7.5 Prometheus + Grafana + cAdvisor

```bash
cat > /opt/appdata/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'pve-hosts'
    static_configs:
      - targets:
          - '192.168.10.101:9100'
          - '192.168.10.102:9100'
          - '192.168.10.103:9100'
          - '192.168.10.104:9100'
    labels:
      type: 'proxmox-host'

  - job_name: 'vms'
    static_configs:
      - targets:
          - '192.168.10.110:9100'
          - '192.168.10.121:9100'
          - '192.168.10.130:9100'
          - '192.168.10.140:9100'
    labels:
      type: 'vm'

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
EOF

mkdir -p /opt/appdata/prometheus/data /opt/appdata/grafana
chmod 777 /opt/appdata/prometheus/data /opt/appdata/grafana
```

```bash
cat > /opt/docker/monitoring/docker-compose.yml << 'EOF'
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    volumes:
      - /opt/appdata/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - /opt/appdata/prometheus/data:/prometheus
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.prometheus.rule=Host(`prometheus.elic01.dev`)"
      - "traefik.http.routers.prometheus.entrypoints=websecure"
      - "traefik.http.routers.prometheus.tls=true"
      - "traefik.http.routers.prometheus.tls.certresolver=cloudflare"
      - "traefik.http.routers.prometheus.middlewares=internal-secured@file"
      - "traefik.http.services.prometheus.loadbalancer.server.port=9090"

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=Homelab@ZW2025!    # ← CHANGE THIS
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_DOMAIN=grafana.elic01.dev
      - GF_SERVER_ROOT_URL=https://grafana.elic01.dev
    volumes:
      - /opt/appdata/grafana:/var/lib/grafana
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.grafana.rule=Host(`grafana.elic01.dev`)"
      - "traefik.http.routers.grafana.entrypoints=websecure"
      - "traefik.http.routers.grafana.tls=true"
      - "traefik.http.routers.grafana.tls.certresolver=cloudflare"
      - "traefik.http.routers.grafana.middlewares=internal-secured@file"
      - "traefik.http.services.grafana.loadbalancer.server.port=3000"

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    restart: unless-stopped
    privileged: true
    command: ['--docker_only=true', '--housekeeping_interval=15s']
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
    networks:
      - proxy

networks:
  proxy:
    external: true
EOF

cd /opt/docker/monitoring && docker compose up -d
```

**Install Node Exporter on ALL 4 Proxmox hosts** (run on each of 101, 102, 103, 104):

```bash
docker run -d \
  --name node-exporter \
  --net="host" \
  --pid="host" \
  -v "/:/host:ro,rslave" \
  --restart unless-stopped \
  prom/node-exporter:latest \
  --path.rootfs=/host
```

### 7.6 Uptime Kuma — Service Monitoring

```bash
cat > /opt/docker/uptime-kuma/docker-compose.yml << 'EOF'
services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    container_name: uptime-kuma
    restart: unless-stopped
    volumes:
      - /opt/appdata/uptime-kuma:/app/data
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.uptime.rule=Host(`uptime.elic01.dev`)"
      - "traefik.http.routers.uptime.entrypoints=websecure"
      - "traefik.http.routers.uptime.tls=true"
      - "traefik.http.routers.uptime.tls.certresolver=cloudflare"
      - "traefik.http.routers.uptime.middlewares=internal-secured@file"
      - "traefik.http.services.uptime.loadbalancer.server.port=3001"

networks:
  proxy:
    external: true
EOF

cd /opt/docker/uptime-kuma && docker compose up -d
```

After starting, open `https://uptime.elic01.dev` and add monitors for every
service URL from Phase 0's service map.

### 7.7 Homepage — Unified Dashboard

```bash
mkdir -p /opt/appdata/homepage

cat > /opt/docker/homepage/docker-compose.yml << 'EOF'
services:
  homepage:
    image: ghcr.io/gethomepage/homepage:latest
    container_name: homepage
    restart: unless-stopped
    volumes:
      - /opt/appdata/homepage:/app/config
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.homepage.rule=Host(`home.elic01.dev`)"
      - "traefik.http.routers.homepage.entrypoints=websecure"
      - "traefik.http.routers.homepage.tls=true"
      - "traefik.http.routers.homepage.tls.certresolver=cloudflare"
      - "traefik.http.routers.homepage.middlewares=internal-secured@file"
      - "traefik.http.services.homepage.loadbalancer.server.port=3000"

networks:
  proxy:
    external: true
EOF

cat > /opt/appdata/homepage/services.yaml << 'EOF'
- Control Plane:
    - Portainer:
        href: https://portainer.elic01.dev
        description: Container Management
        icon: portainer.png
    - Grafana:
        href: https://grafana.elic01.dev
        description: Metrics & Dashboards
        icon: grafana.png
    - Uptime Kuma:
        href: https://uptime.elic01.dev
        description: Service Monitoring
        icon: uptime-kuma.png
    - ntfy:
        href: https://alerts.elic01.dev
        description: Push Notifications
        icon: ntfy.png

- Cloud:
    - Nextcloud:
        href: https://cloud.elic01.dev
        description: Files & Docs
        icon: nextcloud.png
    - Immich:
        href: https://photos.elic01.dev
        description: Photo Library
        icon: immich.png
    - Vaultwarden:
        href: https://vault.elic01.dev
        description: Password Manager
        icon: vaultwarden.png
    - Gitea:
        href: https://git.elic01.dev
        description: Code Repos
        icon: gitea.png

- Productivity:
    - Outline:
        href: https://wiki.elic01.dev
        description: Notes & Wiki
        icon: outline.png
    - Vikunja:
        href: https://tasks.elic01.dev
        description: Tasks & Projects
        icon: vikunja.png
    - Paperless:
        href: https://docs.elic01.dev
        description: Documents
        icon: paperless-ngx.png
    - Memos:
        href: https://notes.elic01.dev
        description: Quick Notes
        icon: memos.png

- AI & Dev:
    - OpenWebUI:
        href: https://ai.elic01.dev
        description: Local AI Chat
        icon: ollama.png
    - n8n:
        href: https://n8n.elic01.dev
        description: Automation
        icon: n8n.png
    - Code Server:
        href: https://code.elic01.dev
        description: VS Code
        icon: code-server.png
    - Flowise:
        href: https://flow.elic01.dev
        description: AI Workflows
        icon: flowise.png

- Media:
    - Jellyfin:
        href: https://tv.elic01.dev
        description: Media Server
        icon: jellyfin.png
    - Navidrome:
        href: https://music.elic01.dev
        description: Music
        icon: navidrome.png
    - Audiobookshelf:
        href: https://books.elic01.dev
        description: Audiobooks
        icon: audiobookshelf.png
    - Sonarr:
        href: https://sonarr.elic01.dev
        description: TV Shows
        icon: sonarr.png

- Infrastructure:
    - PBS:
        href: https://pbs.elic01.dev
        description: Backups
        icon: proxmox.png
    - AdGuard:
        href: https://adguard.elic01.dev
        description: Ad Blocking
        icon: adguard-home.png
    - Technitium:
        href: https://dns.elic01.dev
        description: DNS Server
        icon: technitium-dns.png
    - Speedtest:
        href: https://speedtest.elic01.dev
        description: ISP Monitoring
        icon: speedtest-tracker.png
EOF

cd /opt/docker/homepage && docker compose up -d
```

### 7.8 ntfy — Push Notifications

```bash
cat > /opt/docker/ntfy/docker-compose.yml << 'EOF'
services:
  ntfy:
    image: binwiederhier/ntfy:latest
    container_name: ntfy
    restart: unless-stopped
    command: serve
    environment:
      - TZ=Africa/Harare
      - NTFY_BASE_URL=https://alerts.elic01.dev
      - NTFY_CACHE_FILE=/var/cache/ntfy/cache.db
      - NTFY_AUTH_FILE=/var/lib/ntfy/user.db
      - NTFY_AUTH_DEFAULT_ACCESS=deny-all
      - NTFY_BEHIND_PROXY=true
    volumes:
      - /opt/appdata/ntfy/cache:/var/cache/ntfy
      - /opt/appdata/ntfy/data:/var/lib/ntfy
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ntfy.rule=Host(`alerts.elic01.dev`)"
      - "traefik.http.routers.ntfy.entrypoints=websecure"
      - "traefik.http.routers.ntfy.tls=true"
      - "traefik.http.routers.ntfy.tls.certresolver=cloudflare"
      - "traefik.http.routers.ntfy.middlewares=internal-secured@file"
      - "traefik.http.services.ntfy.loadbalancer.server.port=80"

networks:
  proxy:
    external: true
EOF

cd /opt/docker/ntfy && docker compose up -d
docker exec -it ntfy ntfy user add --role=admin admin
```

Install the ntfy app on your phone. Subscribe to topics at `https://alerts.elic01.dev`.

### 7.9 Watchtower — Automatic Container Updates

```bash
cat > /opt/docker/watchtower/docker-compose.yml << 'EOF'
services:
  watchtower:
    image: containrrr/watchtower:latest
    container_name: watchtower
    restart: unless-stopped
    environment:
      - WATCHTOWER_SCHEDULE=0 0 4 * * *
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_INCLUDE_STOPPED=false
      - WATCHTOWER_NOTIFICATION_URL=generic://alerts.elic01.dev/updates
      - TZ=Africa/Harare
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - proxy

networks:
  proxy:
    external: true
EOF

cd /opt/docker/watchtower && docker compose up -d
```

### 7.10 Jellyfin — Media Server (Netflix Replacement)

```bash
cat > /opt/docker/jellyfin/docker-compose.yml << 'EOF'
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    restart: unless-stopped
    environment:
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/jellyfin/config:/config
      - /opt/appdata/jellyfin/cache:/cache
      - /mnt/media/media:/media:ro
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.jellyfin.rule=Host(`tv.elic01.dev`)"
      - "traefik.http.routers.jellyfin.entrypoints=websecure"
      - "traefik.http.routers.jellyfin.tls=true"
      - "traefik.http.routers.jellyfin.tls.certresolver=cloudflare"
      - "traefik.http.services.jellyfin.loadbalancer.server.port=8096"

networks:
  proxy:
    external: true
EOF

cd /opt/docker/jellyfin && docker compose up -d
```

Open `https://tv.elic01.dev` → complete setup wizard → add libraries:
- Movies: `/media/movies`
- TV Shows: `/media/tv`
- Music: `/media/music`

### 7.11 Navidrome — Music Streaming (Spotify Replacement)

```bash
cat > /opt/docker/navidrome/docker-compose.yml << 'EOF'
services:
  navidrome:
    image: deluan/navidrome:latest
    container_name: navidrome
    restart: unless-stopped
    user: "1000:1000"
    environment:
      - ND_SCANSCHEDULE=1h
      - ND_BASEURL=https://music.elic01.dev
      - ND_MUSICFOLDER=/music
      - ND_TRANSCODINGCACHESIZE=150MiB
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/navidrome:/data
      - /mnt/media/media/music:/music:ro
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.navidrome.rule=Host(`music.elic01.dev`)"
      - "traefik.http.routers.navidrome.entrypoints=websecure"
      - "traefik.http.routers.navidrome.tls=true"
      - "traefik.http.routers.navidrome.tls.certresolver=cloudflare"
      - "traefik.http.services.navidrome.loadbalancer.server.port=4533"

networks:
  proxy:
    external: true
EOF

cd /opt/docker/navidrome && docker compose up -d
```

### 7.12 Audiobookshelf (Audible Replacement)

```bash
cat > /opt/docker/audiobookshelf/docker-compose.yml << 'EOF'
services:
  audiobookshelf:
    image: ghcr.io/advplyr/audiobookshelf:latest
    container_name: audiobookshelf
    restart: unless-stopped
    environment:
      - TZ=Africa/Harare
    volumes:
      - /mnt/media/media/books:/audiobooks
      - /mnt/media/media/ebooks:/ebooks
      - /opt/appdata/audiobookshelf/config:/config
      - /opt/appdata/audiobookshelf/metadata:/metadata
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.abs.rule=Host(`books.elic01.dev`)"
      - "traefik.http.routers.abs.entrypoints=websecure"
      - "traefik.http.routers.abs.tls=true"
      - "traefik.http.routers.abs.tls.certresolver=cloudflare"
      - "traefik.http.services.abs.loadbalancer.server.port=13378"

networks:
  proxy:
    external: true
EOF

cd /opt/docker/audiobookshelf && docker compose up -d
```

### 7.13 *arr Stack — Automated Media Acquisition

```bash
mkdir -p /opt/docker/arr-stack
mkdir -p /opt/appdata/{prowlarr,sonarr,radarr,bazarr,qbittorrent}

cat > /opt/docker/arr-stack/docker-compose.yml << 'EOF'
services:
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    container_name: prowlarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/prowlarr:/config
    networks:
      - proxy
      - arr-net
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.prowlarr.rule=Host(`prowlarr.elic01.dev`)"
      - "traefik.http.routers.prowlarr.entrypoints=websecure"
      - "traefik.http.routers.prowlarr.tls=true"
      - "traefik.http.routers.prowlarr.tls.certresolver=cloudflare"
      - "traefik.http.routers.prowlarr.middlewares=internal-secured@file"
      - "traefik.http.services.prowlarr.loadbalancer.server.port=9696"
      - "traefik.docker.network=proxy"

  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    container_name: sonarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/sonarr:/config
      - /mnt/media/media/tv:/tv
      - /mnt/media/downloads:/downloads
    networks:
      - proxy
      - arr-net
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.sonarr.rule=Host(`sonarr.elic01.dev`)"
      - "traefik.http.routers.sonarr.entrypoints=websecure"
      - "traefik.http.routers.sonarr.tls=true"
      - "traefik.http.routers.sonarr.tls.certresolver=cloudflare"
      - "traefik.http.routers.sonarr.middlewares=internal-secured@file"
      - "traefik.http.services.sonarr.loadbalancer.server.port=8989"
      - "traefik.docker.network=proxy"

  radarr:
    image: lscr.io/linuxserver/radarr:latest
    container_name: radarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/radarr:/config
      - /mnt/media/media/movies:/movies
      - /mnt/media/downloads:/downloads
    networks:
      - proxy
      - arr-net
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.radarr.rule=Host(`radarr.elic01.dev`)"
      - "traefik.http.routers.radarr.entrypoints=websecure"
      - "traefik.http.routers.radarr.tls=true"
      - "traefik.http.routers.radarr.tls.certresolver=cloudflare"
      - "traefik.http.routers.radarr.middlewares=internal-secured@file"
      - "traefik.http.services.radarr.loadbalancer.server.port=7878"
      - "traefik.docker.network=proxy"

  bazarr:
    image: lscr.io/linuxserver/bazarr:latest
    container_name: bazarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/bazarr:/config
      - /mnt/media/media/movies:/movies
      - /mnt/media/media/tv:/tv
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.bazarr.rule=Host(`bazarr.elic01.dev`)"
      - "traefik.http.routers.bazarr.entrypoints=websecure"
      - "traefik.http.routers.bazarr.tls=true"
      - "traefik.http.routers.bazarr.tls.certresolver=cloudflare"
      - "traefik.http.routers.bazarr.middlewares=internal-secured@file"
      - "traefik.http.services.bazarr.loadbalancer.server.port=6767"

  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    container_name: qbittorrent
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Africa/Harare
      - WEBUI_PORT=8080
    volumes:
      - /opt/appdata/qbittorrent:/config
      - /mnt/media/downloads:/downloads
    networks:
      - proxy
      - arr-net
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.qbittorrent.rule=Host(`torrent.elic01.dev`)"
      - "traefik.http.routers.qbittorrent.entrypoints=websecure"
      - "traefik.http.routers.qbittorrent.tls=true"
      - "traefik.http.routers.qbittorrent.tls.certresolver=cloudflare"
      - "traefik.http.routers.qbittorrent.middlewares=internal-secured@file"
      - "traefik.http.services.qbittorrent.loadbalancer.server.port=8080"
      - "traefik.docker.network=proxy"

networks:
  proxy:
    external: true
  arr-net:
    internal: true
EOF

cd /opt/docker/arr-stack && docker compose up -d
```

After starting: Prowlarr → add indexers → sync to Sonarr + Radarr.
Sonarr + Radarr → Settings → Download Clients → add qBittorrent (host: qbittorrent, port: 8080).

---

## Phase 8 — Node2: Cloud & Productivity {#phase-8}

### 8.1 Deploy Cloud VM (Nextcloud)

```bash
ssh root@192.168.10.102

deploy-vm 201 cloud-node2 192.168.10.120 4 12288 80
sleep 90
ssh ubuntu@192.168.10.120

# Verify Docker
docker --version

sudo mkdir -p /opt/docker/nextcloud /opt/appdata/nextcloud
sudo chown -R ubuntu:ubuntu /opt/docker /opt/appdata
```

### 8.2 Nextcloud All-in-One

```bash
cat > /opt/docker/nextcloud/docker-compose.yml << 'EOF'
services:
  nextcloud-aio-mastercontainer:
    image: nextcloud/all-in-one:latest
    container_name: nextcloud-aio-mastercontainer
    restart: always
    ports:
      - "80:80"
      - "8080:8080"
      - "8443:8443"
    environment:
      - APACHE_PORT=11000
      - NEXTCLOUD_DATADIR=/opt/appdata/nextcloud/data
      - NEXTCLOUD_MAX_TIME=3600
      - NEXTCLOUD_MEMORY_LIMIT=1024M
      - NEXTCLOUD_UPLOAD_LIMIT=10G
      - TZ=Africa/Harare
    volumes:
      - nextcloud_aio_mastercontainer:/mnt/docker-aio-config
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /opt/appdata/nextcloud:/mnt/ncdata

volumes:
  nextcloud_aio_mastercontainer:
    name: nextcloud_aio_mastercontainer
EOF

cd /opt/docker/nextcloud && docker compose up -d
```

**Complete AIO setup:**
1. Open `https://192.168.10.120:8080` → save the auto-generated password
2. Enter domain: `cloud.elic01.dev`
3. Enable optional apps: Nextcloud Office ✓, Talk ✓, Memories ✓
4. Click Start Containers (pulls ~8 containers, ~5 min)
5. Note the Nextcloud admin password at the end

The Traefik static route for `cloud.elic01.dev → http://192.168.10.120:11000`
was already created in Phase 7.3.

### 8.3 Deploy Apps VM

```bash
ssh root@192.168.10.102

deploy-vm 202 apps-node2 192.168.10.121 4 16384 60
sleep 90
ssh ubuntu@192.168.10.121

docker --version   # Verify Docker installed by cloud-init

sudo mkdir -p /opt/docker/{immich,paperless,gitea,vaultwarden,stirling-pdf,it-tools,outline,vikunja,freshrss,memos,nocodb,excalidraw,languagetool,wallabag}
sudo mkdir -p /opt/appdata/{immich,paperless,gitea,vaultwarden,outline,vikunja,freshrss,memos,nocodb,languagetool,wallabag}
sudo chown -R ubuntu:ubuntu /opt/docker /opt/appdata
```

### 8.4 Immich (Google Photos Replacement)

```bash
cat > /opt/docker/immich/docker-compose.yml << 'EOF'
services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    container_name: immich_server
    restart: always
    ports:
      - "2283:2283"
    depends_on:
      - redis
      - database
    environment:
      - DB_HOSTNAME=database
      - DB_USERNAME=postgres
      - DB_PASSWORD=ImmichDB@2025!          # ← CHANGE THIS
      - DB_DATABASE_NAME=immich
      - REDIS_HOSTNAME=redis
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/immich/upload:/usr/src/app/upload
    networks:
      - immich-net

  immich-machine-learning:
    image: ghcr.io/immich-app/immich-machine-learning:release
    container_name: immich_ml
    restart: always
    volumes:
      - immich-model-cache:/cache
    networks:
      - immich-net

  redis:
    image: redis:7-alpine
    container_name: immich_redis
    restart: always
    networks:
      - immich-net

  database:
    image: tensorchord/pgvecto-rs:pg16-v0.2.1
    container_name: immich_postgres
    restart: always
    environment:
      - POSTGRES_PASSWORD=ImmichDB@2025!    # ← MATCH ABOVE
      - POSTGRES_USER=postgres
      - POSTGRES_DB=immich
    volumes:
      - /opt/appdata/immich/pgdata:/var/lib/postgresql/data
    networks:
      - immich-net

volumes:
  immich-model-cache:

networks:
  immich-net:
    name: immich-net
EOF

cd /opt/docker/immich && docker compose up -d
```

Traefik routes `photos.elic01.dev → http://192.168.10.121:2283` (set in Phase 7.3).

After Immich is up, open `https://photos.elic01.dev` → create admin account →
install Immich mobile app → Settings → Server URL: `https://photos.elic01.dev`.
Enable background upload for automatic photo backup replacing Google Photos.

### 8.5 Paperless-NGX (Document Management)

```bash
cat > /opt/docker/paperless/docker-compose.yml << 'EOF'
services:
  paperless-redis:
    image: redis:7-alpine
    container_name: paperless_redis
    restart: unless-stopped
    networks:
      - paperless-net

  paperless-db:
    image: postgres:16-alpine
    container_name: paperless_db
    restart: unless-stopped
    environment:
      - POSTGRES_DB=paperless
      - POSTGRES_USER=paperless
      - POSTGRES_PASSWORD=PaperlessDB@2025!
    volumes:
      - /opt/appdata/paperless/pgdata:/var/lib/postgresql/data
    networks:
      - paperless-net

  paperless:
    image: ghcr.io/paperless-ngx/paperless-ngx:latest
    container_name: paperless
    restart: unless-stopped
    ports:
      - "8000:8000"
    depends_on:
      - paperless-redis
      - paperless-db
    environment:
      - PAPERLESS_REDIS=redis://paperless-redis:6379
      - PAPERLESS_DBHOST=paperless-db
      - PAPERLESS_DBUSER=paperless
      - PAPERLESS_DBPASS=PaperlessDB@2025!
      - PAPERLESS_SECRET_KEY=CHANGE_THIS_TO_64_CHAR_RANDOM_STRING
      - PAPERLESS_OCR_LANGUAGE=eng
      - PAPERLESS_TIME_ZONE=Africa/Harare
      - PAPERLESS_URL=https://docs.elic01.dev
      - PAPERLESS_ADMIN_USER=admin
      - PAPERLESS_ADMIN_PASSWORD=Admin@Paperless2025!   # ← CHANGE THIS
    volumes:
      - /opt/appdata/paperless/data:/usr/src/paperless/data
      - /opt/appdata/paperless/media:/usr/src/paperless/media
      - /opt/appdata/paperless/export:/usr/src/paperless/export
      - /opt/appdata/paperless/consume:/usr/src/paperless/consume
    networks:
      - paperless-net

networks:
  paperless-net:
    name: paperless-net
EOF

cd /opt/docker/paperless && docker compose up -d
```

### 8.6 Gitea (GitHub Replacement)

```bash
cat > /opt/docker/gitea/docker-compose.yml << 'EOF'
services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "2222:22"
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__server__DOMAIN=git.elic01.dev
      - GITEA__server__ROOT_URL=https://git.elic01.dev
      - GITEA__server__SSH_DOMAIN=git.elic01.dev
      - GITEA__server__SSH_PORT=2222
      - GITEA__server__HTTP_PORT=3000
      - GITEA__database__DB_TYPE=sqlite3
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/gitea:/data
      - /etc/localtime:/etc/localtime:ro

networks:
  default:
    name: gitea-net
EOF

cd /opt/docker/gitea && docker compose up -d
```

Open `https://git.elic01.dev` → complete the one-time setup wizard → create admin account.
Configure your git remotes: `git remote add origin git@git.elic01.dev:username/repo.git`

### 8.7 Vaultwarden (Password Manager — 1Password Replacement)

```bash
cat > /opt/docker/vaultwarden/docker-compose.yml << 'EOF'
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    ports:
      - "8222:80"
    environment:
      - DOMAIN=https://vault.elic01.dev
      - SIGNUPS_ALLOWED=true              # ← Set to false after creating your account!
      - WEB_VAULT_ENABLED=true
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/vaultwarden:/data

networks:
  default:
    name: vault-net
EOF

cd /opt/docker/vaultwarden && docker compose up -d
```

> **After creating your account at `https://vault.elic01.dev`:**
> Set `SIGNUPS_ALLOWED=false` → `docker compose restart vaultwarden`
> Install Bitwarden browser extension → change server to `https://vault.elic01.dev`
> Install Bitwarden mobile app → server: `https://vault.elic01.dev`

### 8.8 Stirling-PDF (Adobe Acrobat Replacement)

```bash
cat > /opt/docker/stirling-pdf/docker-compose.yml << 'EOF'
services:
  stirling-pdf:
    image: frooodle/s-pdf:latest
    container_name: stirling-pdf
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - DOCKER_ENABLE_SECURITY=false
      - LANGS=en_GB
    volumes:
      - /opt/appdata/stirling-pdf/trainingData:/usr/share/tesseract-ocr/5/tessdata
      - /opt/appdata/stirling-pdf/configs:/configs

networks:
  default:
    name: stirling-net
EOF

cd /opt/docker/stirling-pdf && docker compose up -d
```

### 8.9 IT-Tools (Developer Utility Hub)

```bash
cat > /opt/docker/it-tools/docker-compose.yml << 'EOF'
services:
  it-tools:
    image: corentinth/it-tools:latest
    container_name: it-tools
    restart: unless-stopped
    ports:
      - "8181:80"

networks:
  default:
    name: it-tools-net
EOF

cd /opt/docker/it-tools && docker compose up -d
```

### 8.10 Outline (Notion / Confluence Replacement)

```bash
SECRET_KEY=$(openssl rand -hex 32)
UTILS_SECRET=$(openssl rand -hex 32)

cat > /opt/docker/outline/docker-compose.yml << EOF
services:
  outline:
    image: outlinewiki/outline:latest
    container_name: outline
    restart: unless-stopped
    ports:
      - "3010:3000"
    depends_on:
      - outline-db
      - outline-redis
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - UTILS_SECRET=${UTILS_SECRET}
      - DATABASE_URL=postgres://outline:OutlineDB@2025@outline-db:5432/outline
      - REDIS_URL=redis://outline-redis:6379
      - URL=https://wiki.elic01.dev
      - PORT=3000
      - FORCE_HTTPS=false
      - FILE_STORAGE=local
      - FILE_STORAGE_LOCAL_ROOT_DIR=/var/lib/outline/data
      - DEFAULT_LANGUAGE=en_US
      - AUTH_TYPE=email
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/outline/data:/var/lib/outline/data

  outline-db:
    image: postgres:16-alpine
    container_name: outline_db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=outline
      - POSTGRES_PASSWORD=OutlineDB@2025
      - POSTGRES_DB=outline
    volumes:
      - /opt/appdata/outline/pgdata:/var/lib/postgresql/data

  outline-redis:
    image: redis:7-alpine
    container_name: outline_redis
    restart: unless-stopped

networks:
  default:
    name: outline-net
EOF

mkdir -p /opt/appdata/outline/{data,pgdata}
cd /opt/docker/outline && docker compose up -d
```

### 8.11 Remaining Productivity Apps

```bash
# ── Vikunja (Todoist/Trello replacement) ─────────────────────────────
cat > /opt/docker/vikunja/docker-compose.yml << 'EOF'
services:
  vikunja:
    image: vikunja/vikunja:latest
    container_name: vikunja
    restart: unless-stopped
    ports:
      - "3456:3456"
    environment:
      - VIKUNJA_SERVICE_PUBLICURL=https://tasks.elic01.dev
      - VIKUNJA_DATABASE_TYPE=sqlite
      - VIKUNJA_SERVICE_TIMEZONE=Africa/Harare
    volumes:
      - /opt/appdata/vikunja:/app/vikunja/files
networks:
  default:
    name: vikunja-net
EOF
cd /opt/docker/vikunja && docker compose up -d

# ── FreshRSS (Feedly replacement) ────────────────────────────────────
cat > /opt/docker/freshrss/docker-compose.yml << 'EOF'
services:
  freshrss:
    image: freshrss/freshrss:latest
    container_name: freshrss
    restart: unless-stopped
    ports:
      - "8082:80"
    environment:
      - TZ=Africa/Harare
      - CRON_MIN=17,47
    volumes:
      - /opt/appdata/freshrss/data:/var/www/FreshRSS/data
      - /opt/appdata/freshrss/extensions:/var/www/FreshRSS/extensions
networks:
  default:
    name: freshrss-net
EOF
cd /opt/docker/freshrss && docker compose up -d

# ── Memos (Google Keep replacement) ──────────────────────────────────
cat > /opt/docker/memos/docker-compose.yml << 'EOF'
services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
    restart: unless-stopped
    ports:
      - "5230:5230"
    volumes:
      - /opt/appdata/memos:/var/opt/memos
networks:
  default:
    name: memos-net
EOF
cd /opt/docker/memos && docker compose up -d

# ── NocoDB (Airtable replacement) ────────────────────────────────────
cat > /opt/docker/nocodb/docker-compose.yml << 'EOF'
services:
  nocodb:
    image: nocodb/nocodb:latest
    container_name: nocodb
    restart: unless-stopped
    ports:
      - "8888:8080"
    environment:
      - NC_PUBLIC_URL=https://nocodb.elic01.dev
      - NC_AUTH_JWT_SECRET=CHANGE_THIS_TO_RANDOM_SECRET
    volumes:
      - /opt/appdata/nocodb:/usr/app/data
networks:
  default:
    name: nocodb-net
EOF
cd /opt/docker/nocodb && docker compose up -d

# ── Excalidraw (Whiteboard) ───────────────────────────────────────────
cat > /opt/docker/excalidraw/docker-compose.yml << 'EOF'
services:
  excalidraw:
    image: excalidraw/excalidraw:latest
    container_name: excalidraw
    restart: unless-stopped
    ports:
      - "8383:80"
networks:
  default:
    name: excalidraw-net
EOF
cd /opt/docker/excalidraw && docker compose up -d

# ── LanguageTool (Grammarly replacement) ─────────────────────────────
cat > /opt/docker/languagetool/docker-compose.yml << 'EOF'
services:
  languagetool:
    image: erikvl87/languagetool:latest
    container_name: languagetool
    restart: unless-stopped
    ports:
      - "8010:8010"
    environment:
      - Java_Xms=512m
      - Java_Xmx=1g
    volumes:
      - /opt/appdata/languagetool/ngrams:/ngrams
networks:
  default:
    name: lt-net
EOF
mkdir -p /opt/appdata/languagetool/ngrams
cd /opt/docker/languagetool && docker compose up -d

# ── Wallabag (Pocket replacement) ────────────────────────────────────
cat > /opt/docker/wallabag/docker-compose.yml << 'EOF'
services:
  wallabag:
    image: wallabag/wallabag:latest
    container_name: wallabag
    restart: unless-stopped
    ports:
      - "8083:80"
    environment:
      - SYMFONY__ENV__DOMAIN_NAME=https://read.elic01.dev
      - SYMFONY__ENV__SERVER_NAME=Elic Read Later
      - SYMFONY__ENV__DATABASE_DRIVER=pdo_sqlite
    volumes:
      - /opt/appdata/wallabag/data:/var/www/wallabag/data
      - /opt/appdata/wallabag/images:/var/www/wallabag/web/assets/images
networks:
  default:
    name: wallabag-net
EOF
mkdir -p /opt/appdata/wallabag/{data,images}
cd /opt/docker/wallabag && docker compose up -d
```

---

## Phase 9 — Node3: Network & Security {#phase-9}

### 9.1 Deploy Network VM

```bash
ssh root@192.168.10.103

deploy-vm 301 net-node3 192.168.10.130 2 8192 30
sleep 90
ssh ubuntu@192.168.10.130

sudo mkdir -p /opt/docker/{technitium,adguard,wireguard,crowdsec,speedtest}
sudo mkdir -p /opt/appdata/{technitium,adguard,wireguard,crowdsec,speedtest}
sudo chown -R ubuntu:ubuntu /opt/docker /opt/appdata
```

### 9.2 Technitium DNS Server — Split-Horizon DNS

Technitium must use host networking to bind to port 53 (the standard DNS port).

```bash
cat > /opt/docker/technitium/docker-compose.yml << 'EOF'
services:
  technitium:
    image: technitium/dns-server:latest
    container_name: technitium
    restart: unless-stopped
    network_mode: host       # REQUIRED for port 53 binding
    environment:
      - DNS_SERVER_DOMAIN=dns.elic01.dev
      - DNS_SERVER_ADMIN_PASSWORD=Admin@HomeLab2025!    # ← CHANGE THIS
    volumes:
      - /opt/appdata/technitium:/etc/dns
EOF

cd /opt/docker/technitium && docker compose up -d
echo "Technitium starting at http://192.168.10.130:5380"
```

**Configure Technitium via Web UI:**

Open `http://192.168.10.130:5380` → Login: admin / [your password]

**Step 1 — Create elic01.dev Zone (internal resolution)**

Zones → Add Zone:
- Zone Name: `elic01.dev`
- Type: **Primary Zone**
- Click Add

> **Why create a zone for your real domain?**
> Technitium becomes authoritative for `elic01.dev` on your LAN. This means
> ALL elic01.dev queries from your devices resolve to local IPs — not Cloudflare.
> Public services still work because they resolve to 192.168.10.110 (Traefik).
> Internal services also resolve to 192.168.10.110 but have no Cloudflare record,
> so they're unreachable from the internet.

**Step 2 — Add ALL A Records** (Zones → elic01.dev → Add Record → Type A)

```
# Infrastructure
node1-pve        192.168.10.101
node2-pve        192.168.10.102
node3-pve        192.168.10.103
node4-pve        192.168.10.104
node5-pbs        192.168.10.105
ctrl-node1       192.168.10.110
cloud-node2      192.168.10.120
apps-node2       192.168.10.121
net-node3        192.168.10.130
ai-node4         192.168.10.140

# ALL services → ctrl-node1 (Traefik handles routing from there)
home             192.168.10.110
portainer        192.168.10.110
grafana          192.168.10.110
prometheus       192.168.10.110
uptime           192.168.10.110
alerts           192.168.10.110
portal           192.168.10.110
tv               192.168.10.110
music            192.168.10.110
books            192.168.10.110
sonarr           192.168.10.110
radarr           192.168.10.110
prowlarr         192.168.10.110
torrent          192.168.10.110
bazarr           192.168.10.110
cloud            192.168.10.110
photos           192.168.10.110
git              192.168.10.110
vault            192.168.10.110
docs             192.168.10.110
pdf              192.168.10.110
tools            192.168.10.110
wiki             192.168.10.110
tasks            192.168.10.110
rss              192.168.10.110
notes            192.168.10.110
nocodb           192.168.10.110
whiteboard       192.168.10.110
grammar          192.168.10.110
read             192.168.10.110
adguard          192.168.10.110
speedtest        192.168.10.110
vpn              192.168.10.110
ai               192.168.10.110
n8n              192.168.10.110
flow             192.168.10.110
code             192.168.10.110
lab              192.168.10.110
search           192.168.10.110
api              192.168.10.110
analytics        192.168.10.110
pbs              192.168.10.105   ← PBS has direct route via Traefik static config

# Technitium DNS web UI — direct to net-node3
dns              192.168.10.130
```

**Step 3 — Set Upstream DNS (for resolving everything outside elic01.dev)**

Settings → DNS Client → Upstream DNS:
```
Type: UDP
Address: 1.1.1.1
Port: 53
```
Add second: `8.8.8.8`

**Step 4 — Update Your Router**

In your router admin panel:
- Primary DNS: `192.168.10.130`
- Secondary DNS: `1.1.1.1`

**Step 5 — Test Resolution**

From your laptop on the LAN:

```bash
nslookup grafana.elic01.dev 192.168.10.130
# Must return: 192.168.10.110

nslookup vault.elic01.dev 192.168.10.130
# Must return: 192.168.10.110

nslookup google.com 192.168.10.130
# Must return: a public IP (Technitium forwarding to 1.1.1.1)
```

All three must work before proceeding.

### 9.3 AdGuard Home (Network-Wide Ad Blocking)

```bash
cat > /opt/docker/adguard/docker-compose.yml << 'EOF'
services:
  adguardhome:
    image: adguard/adguardhome:latest
    container_name: adguardhome
    restart: unless-stopped
    ports:
      - "3000:3000"     # Initial setup port
      - "3001:80"       # Admin web UI after setup
      - "853:853/tcp"   # DNS-over-TLS
    volumes:
      - /opt/appdata/adguard/work:/opt/adguardhome/work
      - /opt/appdata/adguard/conf:/opt/adguardhome/conf

networks:
  default:
    name: adguard-net
EOF

mkdir -p /opt/appdata/adguard/{work,conf}
cd /opt/docker/adguard && docker compose up -d
```

Open `http://192.168.10.130:3000` → complete setup → set admin port to 3001.
Configure upstream DNS to Technitium: `127.0.0.1:53`

Add these blocklists (AdGuard → Filters → DNS blocklists → Add blocklist):
```
https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts
https://oisd.nl/
https://someonewhocares.org/hosts/zero/hosts
```

### 9.4 Tailscale (Mesh VPN — Zero Config Remote Access)

Install Tailscale directly on EACH Proxmox host (not inside Docker). Run on all 5:

```bash
# Run on each PVE host: 101, 102, 103, 104, 105
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up --accept-dns=false
# Follow the auth URL printed — approve in Tailscale dashboard
```

After all 5 nodes are authenticated:

```bash
tailscale status
# All nodes should appear with 100.x.x.x IPs
```

**Key benefit:** From anywhere, you can SSH to any node using its Tailscale IP,
or access any internal service by connecting WireGuard first.

### 9.5 WireGuard VPN (Traditional VPN Entry Point)

```bash
# Generate the bcrypt password hash first
docker run --rm ghcr.io/wg-easy/wg-easy wgpw 'YourWireGuardPassword'
# Copy the output — it looks like: $2y$10$XXXX...

cat > /opt/docker/wireguard/docker-compose.yml << 'EOF'
services:
  wg-easy:
    image: ghcr.io/wg-easy/wg-easy:latest
    container_name: wg-easy
    restart: unless-stopped
    ports:
      - "51820:51820/udp"   # WireGuard VPN protocol (router must forward this)
      - "51821:51821/tcp"   # Web UI
    environment:
      - LANG=en
      - WG_HOST=YOUR_HOME_PUBLIC_IP_OR_DDNS   # ← CHANGE THIS (run: curl ifconfig.me)
      - WG_DEFAULT_DNS=192.168.10.130          # Use Technitium DNS on VPN clients
      - WG_DEFAULT_ADDRESS=10.8.0.x
      - WG_PORT=51820
      - PORT=51821
      - UI_CHART_TYPE=1
      # Paste hash from above — keep the $$ prefix
      - PASSWORD_HASH=$$2y$$10$$PASTE_YOUR_HASH_HERE
    volumes:
      - /opt/appdata/wireguard:/etc/wireguard
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      - net.ipv4.ip_forward=1
      - net.ipv4.conf.all.src_valid_mark=1

networks:
  default:
    name: wireguard-net
EOF

cd /opt/docker/wireguard && docker compose up -d
```

> **Router port forward:** Add UDP 51820 → 192.168.10.130 in your router.
> (You added TCP 80/443 and UDP 51820 in Phase 1.5 already.)

When connected via WireGuard from your phone:
- DNS resolves to Technitium (192.168.10.130)
- All `*.elic01.dev` internal services become accessible
- Full valid HTTPS, no certificate warnings

### 9.6 CrowdSec (Intrusion Detection)

```bash
cat > /opt/docker/crowdsec/docker-compose.yml << 'EOF'
services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    container_name: crowdsec
    restart: unless-stopped
    environment:
      - PGID=1000
      - COLLECTIONS=crowdsecurity/linux crowdsecurity/sshd
    volumes:
      - /opt/appdata/crowdsec/data:/var/lib/crowdsec/data
      - /opt/appdata/crowdsec/config:/etc/crowdsec
      - /var/log/auth.log:/var/log/auth.log:ro
      - /var/log/syslog:/var/log/syslog:ro

networks:
  default:
    name: crowdsec-net
EOF

mkdir -p /opt/appdata/crowdsec/{data,config}
cd /opt/docker/crowdsec && docker compose up -d
sleep 10
docker exec crowdsec cscli metrics
```

### 9.7 Speedtest Tracker

```bash
APP_KEY="base64:$(openssl rand -base64 32)"

cat > /opt/docker/speedtest/docker-compose.yml << EOF
services:
  speedtest-tracker:
    image: lscr.io/linuxserver/speedtest-tracker:latest
    container_name: speedtest-tracker
    restart: unless-stopped
    ports:
      - "8082:80"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Africa/Harare
      - APP_KEY=${APP_KEY}
      - DB_CONNECTION=sqlite
      - SPEEDTEST_SCHEDULE=0 */6 * * *
    volumes:
      - /opt/appdata/speedtest:/config
EOF

cd /opt/docker/speedtest && docker compose up -d
```

---

## Phase 10 — Node4: AI & Development {#phase-10}

### 10.1 Deploy AI VM

```bash
ssh root@192.168.10.104

deploy-vm 401 ai-node4 192.168.10.140 6 14336 60
sleep 90
ssh ubuntu@192.168.10.140

sudo mkdir -p /opt/docker/{ollama-webui,n8n,flowise,code-server,jupyter,searxng,hoppscotch,plausible}
sudo mkdir -p /opt/appdata/{ollama,openwebui,n8n,flowise,code-server,jupyter,searxng,plausible}
sudo chown -R ubuntu:ubuntu /opt/docker /opt/appdata
```

### 10.2 Ollama + OpenWebUI (Local AI / ChatGPT Replacement)

> **Hardware note:** AMD Ryzen 5 Pro 2400G = CPU-only inference.
> Use quantized (Q4) models. Speed: ~8–15 tokens/sec on llama3.2:3b.
> All inference stays on your hardware. No data leaves your network.

```bash
cat > /opt/docker/ollama-webui/docker-compose.yml << 'EOF'
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    environment:
      - OLLAMA_KEEP_ALIVE=24h
      - OLLAMA_MAX_LOADED_MODELS=1
    volumes:
      - /opt/appdata/ollama:/root/.ollama
    deploy:
      resources:
        limits:
          memory: 12G
    networks:
      - ai-net

  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: openwebui
    restart: unless-stopped
    ports:
      - "3000:8080"
    depends_on:
      - ollama
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - WEBUI_AUTH=true
      - WEBUI_NAME=Elic AI — elic01.dev
      - WEBUI_URL=https://ai.elic01.dev
      - DEFAULT_MODELS=llama3.2:3b
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/openwebui:/app/backend/data
    networks:
      - ai-net

networks:
  ai-net:
    name: ai-net
EOF

cd /opt/docker/ollama-webui && docker compose up -d

# Pull AI models (downloads from internet — takes time on first run)
sleep 30

docker exec ollama ollama pull llama3.2:3b           # 2GB — fast, general purpose
docker exec ollama ollama pull phi3.5:mini           # 2.3GB — efficient reasoning
docker exec ollama ollama pull mistral:7b-instruct-q4_0  # 4.1GB — best for instructions
docker exec ollama ollama pull nomic-embed-text      # 274MB — document search/RAG
docker exec ollama ollama pull deepseek-coder:6.7b   # 3.8GB — coding assistant

docker exec ollama ollama list
echo "Models ready. Chat at https://ai.elic01.dev"
```

### 10.3 n8n (Zapier / Make Replacement)

```bash
cat > /opt/docker/n8n/docker-compose.yml << 'EOF'
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.elic01.dev
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.elic01.dev
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=N8n@HomeLab2025!    # ← CHANGE THIS
      - GENERIC_TIMEZONE=Africa/Harare
      - N8N_RUNNERS_ENABLED=true
    volumes:
      - /opt/appdata/n8n:/home/node/.n8n

networks:
  default:
    name: n8n-net
EOF

cd /opt/docker/n8n && docker compose up -d
```

**Useful starter workflows:**
- Uptime Kuma alert → ntfy push to phone
- Nextcloud file upload → AI summary via Ollama → save back
- RSS new article → AI classify → save to Wallabag
- Daily Grafana metrics → summary email

### 10.4 Flowise (Visual AI Pipeline Builder)

Connect Ollama to your Nextcloud/Paperless documents for RAG (ask AI questions
against your own files using completely local infrastructure).

```bash
cat > /opt/docker/flowise/docker-compose.yml << 'EOF'
services:
  flowise:
    image: flowiseai/flowise:latest
    container_name: flowise
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - PORT=3000
      - FLOWISE_USERNAME=admin
      - FLOWISE_PASSWORD=Flowise@HomeLab2025!    # ← CHANGE THIS
      - DATABASE_PATH=/root/.flowise
    volumes:
      - /opt/appdata/flowise:/root/.flowise

networks:
  default:
    name: flowise-net
EOF

cd /opt/docker/flowise && docker compose up -d
```

### 10.5 Code Server (VS Code in Browser)

```bash
cat > /opt/docker/code-server/docker-compose.yml << 'EOF'
services:
  code-server:
    image: lscr.io/linuxserver/code-server:latest
    container_name: code-server
    restart: unless-stopped
    ports:
      - "8080:8443"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Africa/Harare
      - PASSWORD=Code@HomeLab2025!         # ← CHANGE THIS
      - SUDO_PASSWORD=Sudo@HomeLab2025!    # ← CHANGE THIS
      - DEFAULT_WORKSPACE=/config/workspace
    volumes:
      - /opt/appdata/code-server:/config

networks:
  default:
    name: code-net
EOF

cd /opt/docker/code-server && docker compose up -d
```

### 10.6 JupyterLab

```bash
cat > /opt/docker/jupyter/docker-compose.yml << 'EOF'
services:
  jupyter:
    image: jupyter/datascience-notebook:latest
    container_name: jupyter
    restart: unless-stopped
    ports:
      - "8888:8888"
    environment:
      - JUPYTER_ENABLE_LAB=yes
      - JUPYTER_TOKEN=CHANGE_THIS_TO_LONG_RANDOM_TOKEN
      - TZ=Africa/Harare
    volumes:
      - /opt/appdata/jupyter:/home/jovyan/work

networks:
  default:
    name: jupyter-net
EOF

cd /opt/docker/jupyter && docker compose up -d
```

### 10.7 SearXNG + Hoppscotch + Plausible

```bash
SECRET=$(openssl rand -hex 32)
mkdir -p /opt/appdata/searxng

cat > /opt/appdata/searxng/settings.yml << EOF
use_default_settings: true
general:
  instance_name: "elic01.dev Private Search"
search:
  safe_search: 0
  autocomplete: 'google'
server:
  secret_key: "${SECRET}"
  limiter: false
  image_proxy: true
  method: "POST"
ui:
  default_theme: simple
  theme_args:
    simple_style: dark
EOF

# SearXNG
cat > /opt/docker/searxng/docker-compose.yml << 'EOF'
services:
  searxng:
    image: searxng/searxng:latest
    container_name: searxng
    restart: unless-stopped
    ports:
      - "8099:8080"
    volumes:
      - /opt/appdata/searxng:/etc/searxng:rw
networks:
  default:
    name: searxng-net
EOF
cd /opt/docker/searxng && docker compose up -d

# Hoppscotch
cat > /opt/docker/hoppscotch/docker-compose.yml << 'EOF'
services:
  hoppscotch:
    image: hoppscotch/hoppscotch:latest
    container_name: hoppscotch
    restart: unless-stopped
    ports:
      - "3002:3000"
networks:
  default:
    name: hoppscotch-net
EOF
cd /opt/docker/hoppscotch && docker compose up -d

# Plausible Analytics
PLAUSIBLE_SECRET=$(openssl rand -base64 64 | tr -d '\n')
mkdir -p /opt/appdata/plausible/{pgdata,clickhouse}

cat > /opt/docker/plausible/docker-compose.yml << EOF
services:
  plausible-db:
    image: postgres:16-alpine
    container_name: plausible_db
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=PlausibleDB@2025
    volumes:
      - /opt/appdata/plausible/pgdata:/var/lib/postgresql/data
    networks:
      - plausible-net

  plausible-events-db:
    image: clickhouse/clickhouse-server:23.3-alpine
    container_name: plausible_events_db
    restart: unless-stopped
    volumes:
      - /opt/appdata/plausible/clickhouse:/var/lib/clickhouse
    ulimits:
      nofile:
        soft: 262144
        hard: 262144
    networks:
      - plausible-net

  plausible:
    image: ghcr.io/plausible/community-edition:v2.0
    container_name: plausible
    restart: unless-stopped
    ports:
      - "8000:8000"
    depends_on:
      - plausible-db
      - plausible-events-db
    environment:
      - BASE_URL=https://analytics.elic01.dev
      - SECRET_KEY_BASE=${PLAUSIBLE_SECRET}
      - DATABASE_URL=postgres://postgres:PlausibleDB@2025@plausible-db:5432/plausible
      - CLICKHOUSE_DATABASE_URL=http://plausible-events-db:8123/plausible_events_db
      - DISABLE_REGISTRATION=invite_only
    networks:
      - plausible-net

networks:
  plausible-net:
    name: plausible-net
EOF
cd /opt/docker/plausible && docker compose up -d
```

---

## Phase 11 — Node5: Proxmox Backup Server {#phase-11}

### 11.1 Install PBS on Node5

**Use the Proxmox Backup Server USB, not the PVE USB.**

Install with:
```
Target disk:  512GB NVMe
Hostname:     node5-pbs.elic01.dev
IP:           192.168.10.105
Netmask:      255.255.255.0
Gateway:      192.168.10.1
DNS:          192.168.10.130
```

After reboot:

```bash
ssh root@192.168.10.105

# Fix repos
sed -i 's/^deb/#deb/g' /etc/apt/sources.list.d/pbs-enterprise.list

cat > /etc/apt/sources.list.d/pbs-no-sub.list << 'EOF'
deb http://download.proxmox.com/debian/pbs bookworm pve-no-subscription
EOF

apt update && apt full-upgrade -y

# Remove subscription nag
sed -Ezi.bak \
  "s/(Ext.Msg.show\(\{[^}]+title: gettext\('No valid sub)/void\(\{ \/\/\1/g" \
  /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js

# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up --accept-dns=false
```

### 11.2 Configure HDD as Backup Datastore

```bash
ssh root@192.168.10.105

lsblk
# Identify 1TB HDD (sda). NVMe (nvme0n1) is system disk — DO NOT TOUCH.

parted /dev/sda --script mklabel gpt
parted /dev/sda --script mkpart primary ext4 0% 100%
mkfs.ext4 -F /dev/sda1 -L backup-data

mkdir -p /mnt/backup-store
HDD_UUID=$(blkid /dev/sda1 -s UUID -o value)
echo "UUID=$HDD_UUID /mnt/backup-store ext4 defaults 0 2" >> /etc/fstab
mount -a

df -h /mnt/backup-store   # Must show ~1TB
```

**Create Datastore via PBS Web UI:**

Open `https://192.168.10.105:8007` → Login as root →
Administration → Datastores → Add Datastore:
- Name: `homelab-backups`
- Backing Path: `/mnt/backup-store`
- Click Create

### 11.3 Connect PBS to Proxmox Cluster

```bash
ssh root@192.168.10.101

# Get PBS fingerprint
FINGERPRINT=$(ssh root@192.168.10.105 \
  "openssl x509 -fingerprint -sha256 -noout -in /etc/proxmox-backup/proxy.pem" \
  | sed 's/SHA256 Fingerprint=//')

echo "PBS Fingerprint: $FINGERPRINT"

# Add PBS as storage target
pvesm add pbs pbs-node5 \
  --server 192.168.10.105 \
  --datastore homelab-backups \
  --username root@pam \
  --password "[your PBS root password]" \
  --fingerprint "$FINGERPRINT"

pvesm status | grep pbs   # Must show pbs-node5 as active
```

### 11.4 Create Backup Schedule

In Proxmox Web UI (`https://192.168.10.101:8006`):
Datacenter → Backup → Add:

```
Schedule:    daily at 02:00
Storage:     pbs-node5
Mode:        Snapshot
Selection:   All VMs (or list: 101,201,202,301,401)
Compression: ZSTD
Retention:
  Keep Last:    7
  Keep Weekly:  4
  Keep Monthly: 6
```

### 11.5 Test Backup + Restore

```bash
# Manual backup of ctrl VM
vzdump 101 --storage pbs-node5 --mode snapshot --compress zstd

# Verify in PBS UI: https://pbs.elic01.dev (via Traefik with internal-only middleware)
# Datastores → homelab-backups → Backups → vm/101/...

# Test restore to a different VMID
# PVE Web UI → Storage → pbs-node5 → Backups → Restore → VMID: 999
# Boot VM 999, SSH in, verify it works, then delete it
```

---

## Phase 12 — Monitoring & Alerting {#phase-12}

### 12.1 Import Grafana Dashboards

Open `https://grafana.elic01.dev` → Dashboards → Import

| Dashboard | ID | Shows |
|-----------|-----|--------|
| Node Exporter Full | `1860` | Per-server CPU/RAM/disk/network |
| Docker & cAdvisor | `11600` | Container metrics |
| Proxmox VE Overview | `10347` | Cluster-wide metrics |
| Traefik v3 | `17346` | HTTP requests, response times |

For each: paste ID → Load → select Prometheus datasource → Import.

### 12.2 Add Node Exporter to VMs

On each VM that should appear in Grafana (run on 192.168.10.110, .121, .130, .140):

```bash
docker run -d \
  --name node-exporter \
  --net="host" \
  --pid="host" \
  -v "/:/host:ro,rslave" \
  --restart unless-stopped \
  prom/node-exporter:latest \
  --path.rootfs=/host
```

### 12.3 Grafana Alerts → ntfy Phone Notifications

In Grafana: Alerting → Contact Points → Add:
- Name: ntfy-phone
- Integration: Webhook
- URL: `https://alerts.elic01.dev/homelab-alerts`
- Method: POST

Create alert rules:

```
Alert: High CPU
  Condition: node_cpu_usage > 90% for 5 min
  Send to: ntfy-phone

Alert: Low Disk Space
  Condition: disk_available < 10%
  Send to: ntfy-phone

Alert: VM Down
  Condition: up == 0 for 2 min
  Send to: ntfy-phone

Alert: PBS Backup Stale
  Condition: last backup > 26 hours
  Send to: ntfy-phone
```

On your phone: install ntfy app → subscribe to `homelab-alerts` at server `https://alerts.elic01.dev`.

---

## Phase 13 — Final Verification Checklist {#phase-13}

### Infrastructure

```bash
ssh root@192.168.10.101

pvecm nodes                 # All 4 online
pvesm status | grep pbs     # pbs-node5 active
tailscale status            # All 5 nodes visible

# NFS export working
showmount -e 192.168.10.101

# Test from ctrl VM
ssh ubuntu@192.168.10.110
df -h /mnt/media            # Must show NFS mount
```

### Wildcard Certificate

```bash
ssh ubuntu@192.168.10.110

# Check Traefik obtained the cert
docker exec traefik cat /letsencrypt/acme.json | \
  python3 -c "import sys,json; d=json.load(sys.stdin); \
  certs=d.get('cloudflare',{}).get('Certificates',[]); \
  print('✓ Cert found' if certs else '✗ No cert yet')"

# Test cert from outside (run from your phone's mobile browser or any device)
# https://vault.elic01.dev should show green padlock — NO warning
# https://grafana.elic01.dev should ALSO show green padlock (same wildcard cert)
```

### DNS Resolution (run from any LAN device)

```bash
nslookup grafana.elic01.dev 192.168.10.130   # → 192.168.10.110  ✓
nslookup vault.elic01.dev 192.168.10.130     # → 192.168.10.110  ✓
nslookup ai.elic01.dev 192.168.10.130        # → 192.168.10.110  ✓
nslookup google.com 192.168.10.130           # → public IP        ✓ (forwarding works)
```

### Service Health Check

```
CONTROL PLANE (internal only — LAN/VPN required)
[ ] https://home.elic01.dev          → Homepage dashboard loads
[ ] https://portainer.elic01.dev     → Container list visible
[ ] https://grafana.elic01.dev       → Dashboards visible
[ ] https://uptime.elic01.dev        → Monitors listed
[ ] https://alerts.elic01.dev        → ntfy topics visible
[ ] https://sonarr.elic01.dev        → Sonarr dashboard
[ ] https://radarr.elic01.dev        → Radarr dashboard
[ ] https://prowlarr.elic01.dev      → Prowlarr indexers

PUBLIC SERVICES (must work from phone on mobile data, not on home WiFi)
[ ] https://vault.elic01.dev         → Vaultwarden vault UI
[ ] https://cloud.elic01.dev         → Nextcloud login
[ ] https://photos.elic01.dev        → Immich photo library
[ ] https://git.elic01.dev           → Gitea dashboard
[ ] https://tv.elic01.dev            → Jellyfin media library
[ ] https://music.elic01.dev         → Navidrome music player
[ ] https://books.elic01.dev         → Audiobookshelf
[ ] https://ai.elic01.dev            → OpenWebUI chat interface

NODE 2 APPS (internal)
[ ] https://docs.elic01.dev          → Paperless login
[ ] https://pdf.elic01.dev           → Stirling-PDF tools
[ ] https://tools.elic01.dev         → IT-Tools list
[ ] https://wiki.elic01.dev          → Outline workspace
[ ] https://tasks.elic01.dev         → Vikunja boards
[ ] https://rss.elic01.dev           → FreshRSS reader
[ ] https://notes.elic01.dev         → Memos notes
[ ] https://nocodb.elic01.dev        → NocoDB tables
[ ] https://whiteboard.elic01.dev    → Excalidraw canvas
[ ] https://grammar.elic01.dev       → LanguageTool (returns JSON)
[ ] https://read.elic01.dev          → Wallabag reader

NODE 3 (internal)
[ ] http://192.168.10.130:5380       → Technitium DNS UI
[ ] https://adguard.elic01.dev       → AdGuard dashboard
[ ] https://speedtest.elic01.dev     → Speedtest history
[ ] https://vpn.elic01.dev           → WireGuard peers UI

NODE 4 (AI internal + ai.elic01.dev public)
[ ] https://ai.elic01.dev            → OpenWebUI (PUBLIC)
[ ] https://n8n.elic01.dev           → n8n workflows
[ ] https://flow.elic01.dev          → Flowise builder
[ ] https://code.elic01.dev          → Code Server
[ ] https://lab.elic01.dev           → JupyterLab
[ ] https://search.elic01.dev        → SearXNG
[ ] https://api.elic01.dev           → Hoppscotch
[ ] https://analytics.elic01.dev     → Plausible

NODE 5
[ ] https://pbs.elic01.dev           → PBS web UI, datastore visible
[ ] https://192.168.10.105:8007      → Also accessible directly
```

### IP Whitelist Verification (Security Test)

Internal services should be BLOCKED from outside your LAN. Test with a VPN
that exits from a different country (NOT your home WireGuard):

```bash
# From a public IP (e.g., phone on mobile WITHOUT home WireGuard):
curl -sk https://grafana.elic01.dev
# Expected: 403 Forbidden (Traefik internal-only middleware blocked it)

curl -sk https://vault.elic01.dev
# Expected: 200 OK (Vaultwarden loads — it's public)
```

---

## Phase 14 — Service Reference Card {#phase-14}

### Complete URL Reference

| Service | URL | Access | Replaces |
|---------|-----|--------|----------|
| **CONTROL PLANE** | | | |
| Homepage | https://home.elic01.dev | Internal | — |
| Portainer | https://portainer.elic01.dev | Internal | Docker Desktop |
| Grafana | https://grafana.elic01.dev | Internal | Datadog / New Relic |
| Prometheus | https://prometheus.elic01.dev | Internal | — |
| Uptime Kuma | https://uptime.elic01.dev | Internal | UptimeRobot |
| ntfy | https://alerts.elic01.dev | Internal | PagerDuty |
| **MEDIA** | | | |
| Jellyfin | https://tv.elic01.dev | **PUBLIC** | Netflix / Plex |
| Navidrome | https://music.elic01.dev | **PUBLIC** | Spotify |
| Audiobookshelf | https://books.elic01.dev | **PUBLIC** | Audible |
| Sonarr | https://sonarr.elic01.dev | Internal | — |
| Radarr | https://radarr.elic01.dev | Internal | — |
| Prowlarr | https://prowlarr.elic01.dev | Internal | — |
| qBittorrent | https://torrent.elic01.dev | Internal | — |
| **CLOUD** | | | |
| Nextcloud | https://cloud.elic01.dev | **PUBLIC** | Google Drive + Docs |
| Immich | https://photos.elic01.dev | **PUBLIC** | Google Photos |
| Gitea | https://git.elic01.dev | **PUBLIC** | GitHub |
| Vaultwarden | https://vault.elic01.dev | **PUBLIC** | 1Password |
| Paperless | https://docs.elic01.dev | Internal | Document scanner |
| Stirling-PDF | https://pdf.elic01.dev | Internal | Adobe Acrobat |
| IT-Tools | https://tools.elic01.dev | Internal | Online tools |
| Outline | https://wiki.elic01.dev | Internal | Notion |
| Vikunja | https://tasks.elic01.dev | Internal | Todoist / Trello |
| FreshRSS | https://rss.elic01.dev | Internal | Feedly |
| Memos | https://notes.elic01.dev | Internal | Google Keep |
| NocoDB | https://nocodb.elic01.dev | Internal | Airtable |
| Excalidraw | https://whiteboard.elic01.dev | Internal | Miro |
| LanguageTool | https://grammar.elic01.dev | Internal | Grammarly |
| Wallabag | https://read.elic01.dev | Internal | Pocket |
| **NETWORK** | | | |
| Technitium DNS | http://dns.elic01.dev:5380 | Internal | Cloudflare DNS |
| AdGuard | https://adguard.elic01.dev | Internal | NextDNS |
| WireGuard | https://vpn.elic01.dev | Internal | NordVPN |
| Speedtest | https://speedtest.elic01.dev | Internal | Fast.com |
| **AI & DEV** | | | |
| OpenWebUI | https://ai.elic01.dev | **PUBLIC** | ChatGPT |
| n8n | https://n8n.elic01.dev | Internal | Zapier / Make |
| Flowise | https://flow.elic01.dev | Internal | LangChain Cloud |
| Code Server | https://code.elic01.dev | Internal | VS Code Online |
| JupyterLab | https://lab.elic01.dev | Internal | Google Colab |
| SearXNG | https://search.elic01.dev | Internal | Google |
| Hoppscotch | https://api.elic01.dev | Internal | Postman |
| Plausible | https://analytics.elic01.dev | Internal | Google Analytics |
| **BACKUP** | | | |
| PBS | https://pbs.elic01.dev | Internal | Veeam / BackBlaze |

### Default Credentials (CHANGE ALL BEFORE USING)

| Service | Username | Password Set In Guide |
|---------|----------|-----------------------|
| All PVE Hosts | root | Set during install |
| PBS Node5 | root | Set during install |
| Ubuntu VMs | ubuntu | HomeLab@ZW2025! |
| Grafana | admin | Homelab@ZW2025! |
| n8n | admin | N8n@HomeLab2025! |
| Code Server | — | Code@HomeLab2025! |
| Flowise | admin | Flowise@HomeLab2025! |
| Paperless | admin | Admin@Paperless2025! |
| Technitium | admin | Admin@HomeLab2025! |
| Portainer | admin | Set on first login |
| Nextcloud | admin | Set by AIO wizard |
| Gitea | — | Set during setup wizard |
| Vaultwarden | — | Set during registration |
| ntfy | admin | Set during user add |

### Mobile App Configuration

| Service | App | Server URL to Enter |
|---------|-----|---------------------|
| Nextcloud | Nextcloud | https://cloud.elic01.dev |
| Immich | Immich | https://photos.elic01.dev |
| Jellyfin | Jellyfin | https://tv.elic01.dev |
| Navidrome | Symfonium / Amperfy | https://music.elic01.dev |
| Vaultwarden | Bitwarden | https://vault.elic01.dev |
| Paperless | Paperless Mobile | https://docs.elic01.dev |
| Audiobookshelf | Audiobookshelf | https://books.elic01.dev |
| Vikunja | Vikunja | https://tasks.elic01.dev |
| ntfy | ntfy | https://alerts.elic01.dev |
| WireGuard | WireGuard | Download config from vpn.elic01.dev |

**Away from home WiFi:**
- Public services (vault, cloud, photos, git, tv, music, books, ai) → work directly
- Internal services → connect WireGuard first, then all `*.elic01.dev` URLs work

---

## Appendix A — Emergency Procedures

### Cluster Quorum Lost

```bash
# If 1 node is offline, run on any surviving node:
pvecm expected 3

# If 2 nodes offline:
pvecm expected 2

# Always restore when all nodes return:
pvecm expected 4
```

### Restore VM from PBS

```bash
# Via CLI on Node1:
qmrestore pbs-node5:backup/vm/101/2025-xx-xx-xx:xx:xx-1 999 \
  --storage local-lvm

# Via Web UI:
# PVE → Storage → pbs-node5 → Backups → select → Restore
```

### Traefik Not Routing

```bash
ssh ubuntu@192.168.10.110

docker logs traefik --tail 50
docker exec traefik traefik version

# Check config files are valid YAML
python3 -c "
import yaml, glob
for f in glob.glob('/opt/appdata/traefik/config/dynamic/*.yml'):
    yaml.safe_load(open(f)); print(f'OK: {f}')
"

# Restart Traefik
cd /opt/docker/traefik && docker compose restart
```

### Certificate Not Issuing

```bash
ssh ubuntu@192.168.10.110

# Check Cloudflare token is valid
docker logs traefik 2>&1 | grep -i "error\|token\|cloudflare\|acme"

# Verify .env has correct values
cat /opt/docker/traefik/.env

# Check acme.json isn't corrupt
cat /opt/appdata/traefik/letsencrypt/acme.json | python3 -m json.tool > /dev/null
echo "JSON valid: $?"

# Force cert renewal (delete and restart)
rm /opt/appdata/traefik/letsencrypt/acme.json
touch /opt/appdata/traefik/letsencrypt/acme.json
chmod 600 /opt/appdata/traefik/letsencrypt/acme.json
cd /opt/docker/traefik && docker compose restart
```

### Technitium DNS Down (LAN Can't Resolve)

If Technitium VM crashes, all `*.elic01.dev` local resolution stops.
Temporarily restore DNS via router:

```
Router DNS: change Primary from 192.168.10.130 to 1.1.1.1
```

Then fix net-node3 VM and start Technitium again. After Technitium is back,
restore router Primary DNS to 192.168.10.130.

---

## Appendix B — Maintenance Schedule

### Daily (Automated)
- PBS backups run at 02:00
- Watchtower checks for container updates at 04:00
- Speedtest runs every 6 hours

### Weekly (5 min manual check)

```bash
ssh root@192.168.10.101
pvecm status             # All 4 nodes online
pvesm status             # pbs-node5 active
tailscale status         # All 5 nodes in mesh
df -h /mnt/hdd-data      # Check disk space
```

### Monthly (30 min)

```bash
# Update all Proxmox nodes
for IP in 192.168.10.101 192.168.10.102 192.168.10.103 192.168.10.104 192.168.10.105; do
  echo "--- Updating $IP ---"
  ssh root@$IP "apt update && apt full-upgrade -y && apt autoremove -y"
done

# Manually update all Docker stacks on each VM
for VM_IP in 192.168.10.110 192.168.10.121 192.168.10.130 192.168.10.140; do
  echo "--- Updating containers on $VM_IP ---"
  ssh ubuntu@$VM_IP "
    for dir in /opt/docker/*/; do
      echo \"Updating \$dir...\"
      cd \"\$dir\" && docker compose pull && docker compose up -d 2>/dev/null
      cd /opt/docker
    done
  "
done
```

---

## Appendix C — AMD Ryzen 5 Pro 2400G Notes

| Task | Performance |
|------|-------------|
| Ollama llama3.2:3b (CPU) | ~8–15 tokens/second |
| Ollama mistral:7b-q4 (CPU) | ~3–6 tokens/second |
| Jellyfin 1080p software transcode | 1–2 streams max |
| Jellyfin direct play (no transcode) | Unlimited |
| Nextcloud sync (10 users active) | Comfortable |
| Immich face recognition batch | Slow, runs in background |
| PBS backup throughput | ~150–200 MB/s to local HDD |

**Best Ollama models for your hardware (16GB node):**
```
llama3.2:3b           2.0GB  — daily general use, fastest
phi3.5:mini           2.3GB  — reasoning and analysis
mistral:7b-q4_0       4.1GB  — best quality, slower
deepseek-coder:6.7b   3.8GB  — coding tasks
nomic-embed-text      274MB  — always keep loaded (embeddings/RAG)
```

Do not run models larger than 8B parameters — they will not fit comfortably
in 14GB RAM leaving headroom for the OS and other processes.

---

*elic-homelab v2.0 — elic01.dev*
*5× HP EliteDesk 705 G4 | Harare, Zimbabwe*
*40+ services | 0 paid subscriptions | 1 domain | 1 wildcard cert*
