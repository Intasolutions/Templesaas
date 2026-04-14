import qrcode
import os
from io import BytesIO
from num2words import num2words
from reportlab.lib import colors
from reportlab.lib.pagesizes import A5, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Malayalam Font Registration ──────────────────
FONT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "fonts", "Meera.ttf")
FONT_REGISTERED = False

try:
    if os.path.exists(FONT_PATH):
        pdfmetrics.registerFont(TTFont('Malayalam', FONT_PATH))
        FONT_REGISTERED = True
except Exception as e:
    print(f"Font registration failed: {e}")

def generate_donation_receipt_pdf(donation):
    """
    Generates a bilingual (Malayalam/English) donation receipt.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(A5), topMargin=20, bottomMargin=20)
    elements = []

    styles = getSampleStyleSheet()
    font_name = 'Malayalam' if FONT_REGISTERED else 'Helvetica'
    
    # ── Custom Bilingual Styles ──────────────────────
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        alignment=1,
        fontSize=18,
        fontName=font_name,
        spaceAfter=5
    )
    
    subtext_style = ParagraphStyle(
        'SubTextStyle',
        parent=styles['Normal'],
        alignment=1,
        fontSize=10,
        fontName=font_name,
        spaceAfter=15
    )

    # 1. Header (Temple Info)
    elements.append(Paragraph(f"<b>{donation.organization.name if donation.organization else 'Temple'}</b>", header_style))
    elements.append(Paragraph(f"സംഭാവന രസീത് / Donation Receipt", subtext_style))
    
    # 2. Main Info Table
    donor_name = "Anonymous" if donation.is_anonymous else (donation.display_name or (donation.devotee.full_name if donation.devotee else "Unknown"))
    amount_in_words = str(donation.amount) # Malayalam num2words is complex, keeping number for now or fallback en
    
    # ── Bilingual Labels ─────────────────────────────
    info_data = [
        [f"രസീത് നം / Receipt No: {donation.receipt_no}", f"തീയതി / Date: {donation.donated_at.strftime('%d-%m-%Y')}"],
        [f"ലഭിച്ചത് / Received from: {donor_name}", ""],
        [f"തുക / Amount: Rs. {donation.amount}/-", ""],
        [f"ആവശ്യം / Purpose: {donation.category.name if donation.category else 'General'}", f"Mode: {donation.payment_mode.upper()}"],
    ]
    
    info_table = Table(info_data, colWidths=[300, 150])
    info_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('SPAN', (0, 1), (1, 1)),
        ('SPAN', (0, 2), (1, 2)),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey), # Optional grid for clean look
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 20))

    # 3. Footer with QR and Signature
    qr = qrcode.QRCode(version=1, box_size=10, border=1)
    qr.add_data(f"RECEIPT:{donation.receipt_no}|AMT:{donation.amount}|TEMPLE:{donation.organization.name if donation.organization else ''}")
    qr.make(fit=True)
    qr_img_data = qr.make_image(fill_color="black", back_color="white")
    
    qr_buffer = BytesIO()
    qr_img_data.save(qr_buffer, format='PNG')
    qr_buffer.seek(0)
    
    qr_img = Image(qr_buffer, width=70, height=70)
    
    footer_data = [
        [qr_img, "", "രസീത് നൽകിയത് / Authorized Signatory"]
    ]
    footer_table = Table(footer_data, colWidths=[100, 200, 150])
    footer_table.setStyle(TableStyle([
        ('FONTNAME', (2, 0), (2, 0), font_name),
        ('ALIGN', (2, 0), (2, 0), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ('FONTSIZE', (2, 0), (2, 0), 8),
    ]))
    
    elements.append(footer_table)
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
