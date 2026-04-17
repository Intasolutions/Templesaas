import io
import os
from reportlab.lib.pagesizes import A5, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Malayalam Font Registration ──────────────────
FONT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "fonts", "Manjari-Regular.ttf")
FONT_BOLD_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "fonts", "Manjari-Bold.ttf")
FONT_REGISTERED = False

try:
    if os.path.exists(FONT_PATH):
        pdfmetrics.registerFont(TTFont('Malayalam', FONT_PATH))
        if os.path.exists(FONT_BOLD_PATH):
            pdfmetrics.registerFont(TTFont('Malayalam-Bold', FONT_BOLD_PATH))
        FONT_REGISTERED = True
except Exception as e:
    print(f"Font registration failed: {e}")

def generate_booking_receipt_pdf(booking):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A5),
        rightMargin=40,
        leftMargin=40,
        topMargin=20,
        bottomMargin=20
    )

    styles = getSampleStyleSheet()
    font_name = 'Malayalam' if FONT_REGISTERED else 'Helvetica'
    font_bold = 'Malayalam-Bold' if FONT_REGISTERED else 'Helvetica-Bold'
    
    # Custom Styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=18,
        fontName=font_bold,
        spaceAfter=5,
        alignment=1, # Center
        textColor=colors.black
    )

    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Normal'],
        fontSize=10,
        fontName=font_name,
        textColor=colors.grey,
        alignment=1,
        spaceAfter=15
    )

    elements = []

    # Institution Name
    inst_name = booking.organization.name if booking.organization else "Devalayam Temple Authority"
    elements.append(Paragraph(f"<b>{inst_name.upper()}</b>", title_style))
    elements.append(Paragraph("വഴിപാട് രസീത് / RITUAL RECEIPT & SEVA VOUCHER", header_style))
    
    # Data Table
    data = [
        [f"രസീത് നം / Receipt No: {booking.receipt_no or 'DRAFT'}", f"തീയതി / Date: {booking.booking_date}"],
        [f"ഭക്തൻ / Devotee: {booking.devotee.full_name if booking.devotee else 'Anonymous'}", f"നക്ഷത്രം / Star: {booking.devotee.nakshatra.name if (booking.devotee and booking.devotee.nakshatra) else ''}"],
        [f"വഴിപാട് / Seva: {booking.pooja.name if booking.pooja else 'General Seva'}", f"Status: {booking.status.upper()}"],
        [f"തുക / Amount: Rs. {booking.amount}/-", f"Payment: {booking.payment_status.upper()}"],
    ]

    t = Table(data, colWidths=[2.5*inch, 2.5*inch])
    t.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), font_name),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('GRID', (0,0), (-1,-1), 0.5, colors.whitesmoke),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.2*inch))

    # Notes
    if booking.notes:
        elements.append(Paragraph("Notes to Priest:", styles['Heading4']))
        elements.append(Paragraph(booking.notes, styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))

    # Footer
    signatory_name = booking.organization.authorized_signatory_name if booking.organization else ""
    signatory_title = booking.organization.authorized_signatory_designation if booking.organization else ""

    footer_text = f"{signatory_name}\n({signatory_title})\nരസീത് നൽകിയത് / Authorized Signatory"
    elements.append(Paragraph(footer_text, ParagraphStyle('Footer', parent=styles['Normal'], fontName=font_name, fontSize=9, textColor=colors.black, alignment=2)))

    doc.build(elements)
    buffer.seek(0)
    return buffer
