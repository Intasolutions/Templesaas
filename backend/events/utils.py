import qrcode
from io import BytesIO
from reportlab.lib.pagesizes import A6
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_event_pass_pdf(event, devotee_name, booking_id, tenant_name="Temple Authority"):
    """
    Generates a Digital Entry Pass (A6) with QR code.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A6, topMargin=10)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'PassTitle',
        parent=styles['Heading1'],
        alignment=1,
        fontSize=14
    )
    
    # Header
    elements.append(Paragraph(f"<b>{tenant_name}</b>", title_style))
    elements.append(Paragraph(f"ENTRY PASS: {event.name}", styles['Normal']))
    elements.append(Spacer(1, 10))
    
    # QR Code
    qr_payload = f"PASS|EVENT:{event.id}|BOOKING:{booking_id}|NAME:{devotee_name}"
    qr = qrcode.QRCode(version=1, box_size=10, border=1)
    qr.add_data(qr_payload)
    qr.make(fit=True)
    qr_img_data = qr.make_image(fill_color="black", back_color="white")
    
    qr_buffer = BytesIO()
    qr_img_data.save(qr_buffer, format='PNG')
    qr_buffer.seek(0)
    
    qr_img = Image(qr_buffer, width=120, height=120)
    elements.append(qr_img)
    elements.append(Spacer(1, 10))
    
    # Detail Info
    elements.append(Paragraph(f"<b>Devotee:</b> {devotee_name}", styles['Normal']))
    elements.append(Paragraph(f"<b>Date:</b> {event.start_date}", styles['Normal']))
    elements.append(Paragraph(f"<b>Location:</b> {event.location}", styles['Normal']))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
