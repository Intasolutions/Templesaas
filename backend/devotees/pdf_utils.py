from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_devotee_list_pdf(tenant_name, devotees):
    """
    Generates a professional Devotee List in A4 landscape.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(A4))
    elements = []

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        alignment=1,
        spaceAfter=20
    )
    
    # Header
    elements.append(Paragraph(f"<b>{tenant_name}</b>", title_style))
    elements.append(Paragraph("Devotee Master List", styles['Heading2']))
    elements.append(Spacer(1, 12))

    # Table Data
    data = [["ID", "Full Name", "Phone", "Email", "Gothra / Nakshatra", "Address"]]
    
    for d in devotees:
        gothra_nakshatra = f"{d.gothra.name if d.gothra else ''} / {d.nakshatra.name if d.nakshatra else ''}"
        data.append([
            str(d.id),
            d.full_name,
            d.phone,
            d.email,
            gothra_nakshatra,
            d.address[:50] + "..." if len(d.address) > 50 else d.address
        ])

    # Table Styling
    table = Table(data, colWidths=[40, 150, 100, 150, 150, 200])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    buffer.seek(0)
    return buffer
