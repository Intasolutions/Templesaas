import io
from reportlab.lib.pagesizes import A5, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

def generate_booking_receipt_pdf(booking):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A5),
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=18,
        spaceAfter=12,
        alignment=1, # Center
        textColor=colors.HexColor("#000000")
    )

    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.grey,
        alignment=1,
        spaceAfter=20
    )

    elements = []

    # Institution Name
    inst_name = booking.organization.name if booking.organization else "Devalayam Temple Authority"
    elements.append(Paragraph(inst_name.upper(), title_style))
    elements.append(Paragraph("OFFICIAL RITUAL RECEIPT & SEVA VOUCHER", header_style))
    elements.append(Spacer(1, 0.2*inch))

    # Data Table
    data = [
        ["Receipt No:", booking.receipt_no or "DRAFT-" + str(booking.id), "Date:", str(booking.booking_date)],
        ["Devotee:", booking.devotee.full_name if booking.devotee else "Anonymous", "ID:", f"DEV-{booking.devotee.id if booking.devotee else '000'}"],
        ["Seva Name:", booking.pooja.name if booking.pooja else "General Seva", "Status:", booking.status.upper()],
        ["Amount:", f"INR {booking.amount}", "Payment:", booking.payment_status.upper()],
    ]

    t = Table(data, colWidths=[1*inch, 2*inch, 1*inch, 1.5*inch])
    t.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('TEXTCOLOR', (0,0), (0,-1), colors.grey),
        ('TEXTCOLOR', (2,0), (2,-1), colors.grey),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('GRID', (0,0), (-1,-1), 0.5, colors.whitesmoke),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.4*inch))

    # Notes
    if booking.notes:
        elements.append(Paragraph("Notes to Priest:", styles['Heading4']))
        elements.append(Paragraph(booking.notes, styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))

    # Footer
    footer_text = "This is a computer-generated document and does not require a physical signature. Returns/Refunds are subject to temple policy."
    elements.append(Paragraph(footer_text, ParagraphStyle('Footer', parent=styles['Normal'], fontSize=7, textColor=colors.grey, alignment=1)))

    doc.build(elements)
    buffer.seek(0)
    return buffer
