from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pooja_daily_pdf(tenant_name, date_str, results):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        alignment=1,  # Center
        spaceAfter=20
    )
    
    # Header
    elements.append(Paragraph(f"<b>{tenant_name}</b>", title_style))
    elements.append(Paragraph(f"Daily Pooja List - {date_str}", styles['Heading2']))
    elements.append(Spacer(1, 12))

    # Table Data
    data = [["#", "Devotee Name", "Gothra / Nakshatra", "Pooja", "Time", "Amount"]]
    
    for i, b in enumerate(results, 1):
        gothra_nakshatra = f"{b['gothra']} / {b['nakshatra']}"
        data.append([
            str(i),
            b['devotee_name'],
            gothra_nakshatra,
            b['pooja_name'],
            b['time_slot'],
            b['amount_offering']
        ])

    # Table Styling
    table = Table(data, colWidths=[20, 150, 120, 120, 60, 60])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, i % 2 == 0), (-1, i % 2 == 0), colors.whitesmoke), # Simple alternating rows
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    buffer.seek(0)
    return buffer
