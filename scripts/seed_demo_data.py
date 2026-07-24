#!/usr/bin/env python3
"""
CloudCanvas – Demo Data Seed Script
=====================================
Generates mock whiteboard architecture sketch images and a sample
SOC2 compliance policy document for rapid testing without manual uploads.

Usage:
    python scripts/seed_demo_data.py

Output:
    scripts/demo_data/
    ├── architecture_sketch_basic.png
    ├── architecture_sketch_microservices.png
    ├── architecture_sketch_serverless.png
    └── SOC2_Compliance_Rules.txt
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

# Ensure Pillow is available
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("ERROR: Pillow is required. Install via: pip install pillow")
    sys.exit(1)


# ── Output Directory ──────────────────────────────────────────────────────

OUTPUT_DIR = Path(__file__).parent / "demo_data"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ── Colour Palette (whiteboard aesthetic) ────────────────────────────────

BG_COLOR = (255, 255, 252)  # off-white
PEN_COLOR = (30, 30, 80)     # dark ink
BOX_COLOR = (60, 60, 140)    # deep blue for boxes
ARROW_COLOR = (100, 100, 160)
ACCENT_COLOR = (220, 80, 60) # red for annotations
LABEL_COLOR = (40, 40, 100)
FILL_LIGHT = (230, 235, 255) # light fill for boxes


def _get_font(size: int):
    """Try to load a clean font; fall back to default."""
    try:
        return ImageFont.truetype("arial.ttf", size)
    except (OSError, IOError):
        try:
            return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)
        except (OSError, IOError):
            return ImageFont.load_default()


def _draw_box(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int,
              label: str, font, fill=FILL_LIGHT):
    """Draw a rounded-corner-ish box with a label."""
    draw.rectangle([x, y, x + w, y + h], fill=fill, outline=BOX_COLOR, width=2)
    bbox = draw.textbbox((0, 0), label, font=font)
    tw = bbox[2] - bbox[0]
    tx = x + (w - tw) // 2
    ty = y + 8
    draw.text((tx, ty), label, fill=LABEL_COLOR, font=font)


def _draw_arrow(draw: ImageDraw.ImageDraw, x1: int, y1: int, x2: int, y2: int,
                label: str = "", font=None):
    """Draw a line with an arrowhead and optional label."""
    draw.line([(x1, y1), (x2, y2)], fill=ARROW_COLOR, width=2)
    # Simple arrowhead
    dx = x2 - x1
    dy = y2 - y1
    length = max((dx**2 + dy**2)**0.5, 1)
    ux, uy = dx / length, dy / length
    # Arrowhead lines
    size = 10
    draw.line([(x2, y2), (x2 - size * ux + size * uy * 0.5,
                           y2 - size * uy - size * ux * 0.5)], fill=ARROW_COLOR, width=2)
    draw.line([(x2, y2), (x2 - size * ux - size * uy * 0.5,
                           y2 - size * uy + size * ux * 0.5)], fill=ARROW_COLOR, width=2)
    if label and font:
        mx, my = (x1 + x2) // 2, (y1 + y2) // 2 - 12
        draw.text((mx, my), label, fill=ACCENT_COLOR, font=font)


# ── Sketch 1: Basic 3-Tier Architecture ──────────────────────────────────

def generate_basic_sketch():
    img = Image.new("RGB", (900, 650), BG_COLOR)
    draw = ImageDraw.Draw(img)
    font_lg = _get_font(16)
    font_sm = _get_font(12)
    font_title = _get_font(20)

    # Title
    draw.text((30, 20), "3-Tier AWS Architecture", fill=PEN_COLOR, font=font_title)
    draw.text((30, 50), "(whiteboard sketch)", fill=ACCENT_COLOR, font=font_sm)

    # Internet
    draw.ellipse([380, 80, 520, 140], outline=BOX_COLOR, width=2)
    draw.text((410, 100), "Internet", fill=LABEL_COLOR, font=font_sm)

    # ALB
    _draw_box(draw, 350, 180, 200, 50, "ALB (Load Balancer)", font_sm)
    _draw_arrow(draw, 450, 140, 450, 180, "", font_sm)

    # EC2 instances
    _draw_box(draw, 100, 290, 160, 55, "EC2 (Web Server 1)", font_sm)
    _draw_box(draw, 370, 290, 160, 55, "EC2 (Web Server 2)", font_sm)
    _draw_box(draw, 640, 290, 160, 55, "EC2 (Web Server 3)", font_sm)
    _draw_arrow(draw, 400, 230, 180, 290, "", font_sm)
    _draw_arrow(draw, 450, 230, 450, 290, "", font_sm)
    _draw_arrow(draw, 500, 230, 720, 290, "", font_sm)

    # RDS
    _draw_box(draw, 300, 420, 200, 55, "RDS (MySQL)", font_sm,
              fill=(255, 235, 230))
    _draw_arrow(draw, 180, 345, 400, 420, "SQL", font_sm)
    _draw_arrow(draw, 450, 345, 400, 420, "SQL", font_sm)
    _draw_arrow(draw, 720, 345, 400, 420, "SQL", font_sm)

    # S3
    _draw_box(draw, 650, 420, 160, 55, "S3 (Static Assets)", font_sm,
              fill=(230, 255, 230))

    # VPC boundary
    draw.rectangle([60, 160, 860, 520], outline=PEN_COLOR, width=2)
    draw.text((70, 165), "VPC", fill=PEN_COLOR, font=font_lg)

    # Annotations (handwritten style)
    draw.text((100, 540), "⚠ Single AZ?", fill=ACCENT_COLOR, font=font_lg)
    draw.text((350, 540), "⚠ No encryption?", fill=ACCENT_COLOR, font=font_lg)
    draw.text((620, 540), "⚠ Public subnets?", fill=ACCENT_COLOR, font=font_lg)

    path = OUTPUT_DIR / "architecture_sketch_basic.png"
    img.save(path, "PNG")
    print(f"  [OK] {path}")


# ── Sketch 2: Microservices Architecture ─────────────────────────────────

def generate_microservices_sketch():
    img = Image.new("RGB", (1000, 700), BG_COLOR)
    draw = ImageDraw.Draw(img)
    font_sm = _get_font(12)
    font_title = _get_font(20)

    draw.text((30, 20), "Microservices on AWS ECS", fill=PEN_COLOR, font=font_title)

    # API Gateway
    _draw_box(draw, 400, 80, 200, 45, "API Gateway", font_sm)

    # ECS Services
    services = [
        (80, 200, "Auth Service"),
        (300, 200, "Order Service"),
        (520, 200, "Payment Service"),
        (740, 200, "Notification Svc"),
    ]
    for x, y, name in services:
        _draw_box(draw, x, y, 170, 50, name, font_sm)
        _draw_arrow(draw, 500, 125, x + 85, y, "", font_sm)

    # Databases
    dbs = [
        (80, 340, "DynamoDB", (255, 245, 230)),
        (300, 340, "RDS Postgres", (255, 235, 230)),
        (520, 340, "RDS Postgres", (255, 235, 230)),
        (740, 340, "SQS Queue", (230, 255, 230)),
    ]
    for i, (x, y, name, color) in enumerate(dbs):
        _draw_box(draw, x, y, 170, 50, name, font_sm, fill=color)
        _draw_arrow(draw, services[i][0] + 85, 250, x + 85, y, "", font_sm)

    # ElastiCache
    _draw_box(draw, 350, 470, 200, 50, "ElastiCache (Redis)", font_sm,
              fill=(230, 245, 255))

    # CloudWatch
    _draw_box(draw, 650, 470, 200, 50, "CloudWatch Logs", font_sm,
              fill=(245, 245, 255))

    # VPC
    draw.rectangle([40, 60, 960, 560], outline=PEN_COLOR, width=2)
    draw.text((50, 65), "VPC", fill=PEN_COLOR, font=_get_font(16))

    # Annotations
    draw.text((80, 590), "⚠ No circuit breakers", fill=ACCENT_COLOR, font=_get_font(14))
    draw.text((400, 590), "⚠ Shared DB anti-pattern", fill=ACCENT_COLOR, font=_get_font(14))
    draw.text((700, 590), "⚠ No service mesh", fill=ACCENT_COLOR, font=_get_font(14))

    path = OUTPUT_DIR / "architecture_sketch_microservices.png"
    img.save(path, "PNG")
    print(f"  [OK] {path}")


# ── Sketch 3: Serverless Architecture ────────────────────────────────────

def generate_serverless_sketch():
    img = Image.new("RGB", (900, 600), BG_COLOR)
    draw = ImageDraw.Draw(img)
    font_sm = _get_font(12)
    font_title = _get_font(20)

    draw.text((30, 20), "Serverless Event-Driven (AWS)", fill=PEN_COLOR, font=font_title)

    # CloudFront + S3
    _draw_box(draw, 50, 100, 180, 45, "CloudFront CDN", font_sm)
    _draw_box(draw, 50, 190, 180, 45, "S3 (SPA Hosting)", font_sm)
    _draw_arrow(draw, 140, 145, 140, 190, "", font_sm)

    # API Gateway
    _draw_box(draw, 320, 100, 180, 45, "API Gateway (REST)", font_sm)
    _draw_arrow(draw, 230, 122, 320, 122, "HTTPS", font_sm)

    # Lambda Functions
    lambdas = [
        (320, 210, "Lambda: Users"),
        (320, 290, "Lambda: Orders"),
        (320, 370, "Lambda: Payments"),
    ]
    for x, y, name in lambdas:
        _draw_box(draw, x, y, 180, 42, name, font_sm, fill=(255, 250, 230))
    _draw_arrow(draw, 410, 145, 410, 210, "", font_sm)

    # DynamoDB
    _draw_box(draw, 600, 210, 180, 45, "DynamoDB", font_sm, fill=(255, 235, 220))
    _draw_arrow(draw, 500, 231, 600, 231, "", font_sm)

    # SQS
    _draw_box(draw, 600, 290, 180, 45, "SQS Queue", font_sm, fill=(230, 255, 230))
    _draw_arrow(draw, 500, 311, 600, 311, "", font_sm)

    # SNS
    _draw_box(draw, 600, 370, 180, 45, "SNS Topics", font_sm, fill=(240, 230, 255))
    _draw_arrow(draw, 500, 391, 600, 391, "", font_sm)

    # Cognito
    _draw_box(draw, 50, 300, 180, 45, "Cognito (Auth)", font_sm, fill=(255, 240, 240))
    _draw_arrow(draw, 140, 300, 320, 230, "JWT", font_sm)

    # Annotations
    draw.text((50, 480), "⚠ Cold starts on payment path?", fill=ACCENT_COLOR, font=_get_font(14))
    draw.text((400, 480), "⚠ No DLQ on SQS", fill=ACCENT_COLOR, font=_get_font(14))
    draw.text((650, 480), "⚠ Missing WAF", fill=ACCENT_COLOR, font=_get_font(14))

    path = OUTPUT_DIR / "architecture_sketch_serverless.png"
    img.save(path, "PNG")
    print(f"  [OK] {path}")


# ── Compliance Document: SOC2 Compliance Rules ──────────────────────────

SOC2_COMPLIANCE_TEXT = """\
============================================================
  ACME Corp – Cloud Infrastructure Security Policy
  Framework: SOC 2 Type II + ISO 27001
  Document ID: SEC-POL-2024-001
  Effective Date: January 1, 2024
  Classification: INTERNAL – MANDATORY
============================================================

1. ENCRYPTION REQUIREMENTS
   1.1. All data at rest MUST be encrypted using AES-256 or equivalent.
        AWS: Enable SSE-S3, SSE-KMS, or SSE-C on all S3 buckets.
        RDS: Enable storage encryption with AWS KMS.
        EBS: All volumes must use encrypted AMIs.
   1.2. All data in transit MUST use TLS 1.2 or higher.
        Load balancers must terminate TLS with ACM certificates.
        Internal service-to-service communication must use mTLS where feasible.
   1.3. KMS key rotation MUST be enabled with a maximum rotation period of 365 days.

2. NETWORK SECURITY
   2.1. All compute workloads (EC2, ECS, Lambda) MUST reside in private subnets.
   2.2. Public subnets are permitted ONLY for internet-facing load balancers and NAT gateways.
   2.3. Security groups MUST follow least-privilege: no 0.0.0.0/0 ingress rules
        except on port 443 for public ALBs.
   2.4. VPC Flow Logs MUST be enabled on all VPCs and stored for minimum 90 days.
   2.5. Network ACLs must explicitly deny all traffic not required by the application.

3. HIGH AVAILABILITY & DISASTER RECOVERY
   3.1. All production databases MUST be deployed in Multi-AZ configuration.
   3.2. Application tier MUST span at least 2 Availability Zones.
   3.3. RTO (Recovery Time Objective): Maximum 4 hours.
   3.4. RPO (Recovery Point Objective): Maximum 1 hour.
   3.5. Automated backups MUST be enabled with minimum 30-day retention.
   3.6. Cross-region read replicas are RECOMMENDED for critical databases.

4. IDENTITY & ACCESS MANAGEMENT
   4.1. All IAM policies MUST follow the principle of least privilege.
   4.2. Root account usage is PROHIBITED for daily operations.
   4.3. MFA MUST be enabled on all human IAM accounts.
   4.4. Service accounts must use IAM roles (not access keys) where possible.
   4.5. IAM access keys MUST be rotated every 90 days.
   4.6. Cross-account access must use AWS STS AssumeRole with external ID.

5. LOGGING & MONITORING
   5.1. AWS CloudTrail MUST be enabled in all regions.
   5.2. CloudWatch Alarms MUST be configured for:
        - CPU utilisation > 80%
        - Memory utilisation > 85%
        - Disk usage > 90%
        - 5xx error rate > 1%
   5.3. All logs must be centralised in a dedicated logging account.
   5.4. Log retention: Minimum 1 year for audit trails, 90 days for application logs.

6. RESOURCE TAGGING (MANDATORY)
   6.1. All resources MUST have the following tags:
        - Environment: (production | staging | development)
        - Owner: (team email)
        - CostCenter: (department code)
        - Project: (project name)
        - DataClassification: (public | internal | confidential | restricted)
   6.2. Untagged resources will be flagged for decommissioning after 7 days.

7. CONTAINER & SERVERLESS SECURITY
   7.1. Container images MUST be scanned for vulnerabilities before deployment.
   7.2. ECR image scanning must be enabled with critical finding blocking.
   7.3. Lambda functions must have minimal IAM permissions scoped to specific resources.
   7.4. Lambda concurrency limits MUST be configured to prevent runaway costs.

8. COST GOVERNANCE
   8.1. AWS Budgets MUST be configured with alerts at 50%, 80%, and 100% thresholds.
   8.2. Reserved Instances or Savings Plans must be evaluated quarterly.
   8.3. Unused resources (unattached EBS, idle EC2) must be reviewed weekly.

============================================================
  Approved by: CISO Office | Last Review: Q4 2024
  Next Review: Q2 2025
============================================================
"""


def generate_compliance_document():
    """Write the SOC2 compliance policy as a .txt file."""
    path = OUTPUT_DIR / "SOC2_Compliance_Rules.txt"
    path.write_text(SOC2_COMPLIANCE_TEXT, encoding="utf-8")
    print(f"  [OK] {path}")


# ── Main ──────────────────────────────────────────────────────────────────

def main():
    print("\n[*] CloudCanvas Demo Data Generator")
    print("=" * 42)
    print(f"Output directory: {OUTPUT_DIR.resolve()}\n")

    print("Generating architecture sketches...")
    generate_basic_sketch()
    generate_microservices_sketch()
    generate_serverless_sketch()

    print("\nGenerating compliance documents...")
    generate_compliance_document()

    print(f"\n[OK] All demo data generated in: {OUTPUT_DIR.resolve()}")
    print("\nUsage:")
    print("  1. Upload any sketch image to CloudCanvas")
    print("  2. Attach SOC2_Compliance_Rules.txt as the compliance document")
    print("  3. Hit 'Analyze System Design' to see compliance-aware analysis\n")


if __name__ == "__main__":
    main()
