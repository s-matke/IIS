# create PDF report for production

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable, KeepInFrame, ListFlowable, ListItem
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from io import BytesIO
from production.models import ProductionOrder, ProductionProgress
from inventory.models import ProductInventory, MaterialInventory
from datetime import datetime
from material.models import *

text_style = ParagraphStyle(
        "CustomStyle",
        parent=getSampleStyleSheet()["Normal"],
        fontName="Helvetica",
        textColor=colors.black,
        fontSize=8,
        spaceAfter=10)


def generate_gridless_table(production_order):
    planner = production_order.plan.planner.user.first_name + " " + production_order.plan.planner.user.last_name
    approved_by = production_order.manager.user.first_name + " " + production_order.manager.user.last_name
    machine = production_order.machine.name

    start_production = production_order.plan.start_date.strftime("%d/%m/%Y")
    end_production = production_order.plan.end_date.strftime("%d/%m/%Y")
    today = datetime.now().strftime('%d/%m/%Y')


    data = [
        ['Planned by: ' + planner, 'Approved by: ' + approved_by, 'Machine: ' + machine],
        ['Reported on: ' + today, 'Start of production: ' + start_production, 'End of production: ' + end_production]
        ]

    # Create a table with the data
    table = Table(data, colWidths=[1.5 * inch] * 3)

    # Set the style for the table
    table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0, colors.white),  # Remove grid lines
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),  # Set text color
        ('FONTSIZE', (0, 0), (-1, -1), 6),  # Set font size
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),  # Set alignment
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),  # Set vertical alignment
    ]))
    
    return table

def generate_table(data, available_width):
    table = Table(data, colWidths=[1.25 * inch] * 3)
    # table = Table(data, colWidths=available_width / 3)
    # available_width
    # Set the style for the table
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 7),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 6),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        # ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 2),
        ('MAXWIDTH', (0, 0), (-1, -1), available_width),
    ]))

    return table

def get_product_info(available_width, product):
    inventory_quantity = "{:,}".format(ProductInventory.objects.filter(product=product).get().quantity)
    data = [['NAME', 'STATUS', 'LEAD TIME [min]', 'PRICE OF PRODUCING [€]', 'INVENTORY'],
            [product.name, product.status, str(float(product.lead_time)), str(float(product.price_of_producing)), inventory_quantity]]

    return generate_table(data, available_width)


def get_material_info(available_width, product):

    boms = BillOfMaterial.objects.filter(product = product)

    # material_info = []

    data = [['NAME', 'PRICE [€]', 'QUANTITY', 'COST/PRODUCTION [€]', 'SUPPLIER']]
    
    for bom in boms:
        info = [bom.material.name, str(float(bom.material.price)), str(bom.quantity), str(float(bom.material.price) * bom.quantity), bom.material.supplier.name]
        data.append(info)


    return generate_table(data, available_width)

def get_production_info(available_width, production):
    data = [['PRODUCED', 'COST [€]', 'DAYS PRODUCING', 'APPROVED ON', '']]

    produced = ProductionProgress.objects.filter(production = production).get().produced_tracker
    days_producing = (production.plan.end_date - production.plan.start_date).days
    total_cost = produced * float(production.plan.product.price_of_producing)
    approved_on = production.added_on.strftime('%d/%m/%Y')
    info = [produced, "{:,}".format(total_cost), days_producing, approved_on]

    data.append(info)    
    
    return generate_table(data, available_width)

def get_inventory_status(available_width, production_order):
    data = [['MATERIAL', 'TOTAL QUANTITY', 'TOTAL COST [€]', 'REMAINING', '']]

    produced_amount = ProductionProgress.objects.filter(production = production_order).get().produced_tracker
    
    product = production_order.plan.product

    boms = BillOfMaterial.objects.filter(product=product)

    for bom in boms:
        total_quantity = produced_amount * float(bom.quantity)
        inventory_quantity = MaterialInventory.objects.filter(material=bom.material).get().quantity
        info = [bom.material.name, int(total_quantity), "{:,}".format(total_quantity * float(bom.material.price)), "{:,}".format(inventory_quantity)]
        data.append(info)
    
    return generate_table(data, available_width)

def product_text_info(product):
    today = datetime.now().strftime('%d %b, %Y')
    created = product.created.strftime('%d %b, %Y')
    product_inventory_quantity = str(ProductInventory.objects.filter(product=product).get().quantity)
    ret = "Report created for production of product: <u><b>" + product.name + "</b></u>. The cost of producing one unit is <b>" + str(product.price_of_producing) + "€</b>, with the time of producing being <b> " + str(product.lead_time) + " minutes</b>. "
    status = "IN PRODUCTION" if product.status == Product.ProductStatus.IN_PRODUCTION else "OUT OF PRODUCTION"
    since = ""
    if product.status == Product.ProductStatus.IN_PRODUCTION:
        since = "since <b>" + created + "</b>"
    ret += "The product is <b>" + status + "</b> " + since + ". As of <u>" + today + "</u> the current inventory status of this product indicates a quantity of <b>" + product_inventory_quantity + "</b> units available.<br/><br/>"
    ret += "Table overview of the above information:"

    return ret 

# def get_text_style():
#     text_style = ParagraphStyle(
#         "CustomStyle",
#         parent=getSampleStyleSheet()["Normal"],
#         fontName="Helvetica",
#         textColor=colors.black,
#         fontSize=8,
#         spaceAfter=10,
#     )
#     return text_style

# Function to create the PDF document
def create_pdf(content, production_id):
    # Create a new PDF document using the letter size page
    # pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(content, pagesize=letter)
    
    left_margin = 2 * inch 
    right_margin = 2 * inch
    available_width = doc.width - left_margin - right_margin

    production_order = ProductionOrder.objects.filter(id=production_id).get()

    gridless_table = generate_gridless_table(production_order)
    product_table = get_product_info(available_width, production_order.plan.product)
    material_table = get_material_info(available_width, production_order.plan.product)
    production_table = get_production_info(available_width, production_order)
    inventory_table = get_inventory_status(available_width, production_order)

    product_frame = KeepInFrame(doc.width, doc.height, [product_table])
    material_frame = KeepInFrame(doc.width, doc.height, [material_table])
    production_frame = KeepInFrame(doc.width, doc.height, [production_table])
    inventory_frame = KeepInFrame(doc.width, doc.height, [inventory_table])

    # Create a list to hold the elements of the PDF document
    elements = []

    # TITLE
    # of the report
    styles = getSampleStyleSheet()
    title = Paragraph("<b>Production Report</b>", styles["Title"])
    elements.append(title)

    # HORIZONTAL LINE
    # below the title in the document
    horiz_line = HRFlowable(width="100%")
    elements.append(Spacer(1, 0.1 * inch))
    elements.append(horiz_line)

    # GRIDLESS TABLE
    # information regarding managers
    elements.append(gridless_table)
    elements.append(Spacer(1, 0.1 * inch))

    # PRODUCT INFORMATION TEXT
    # basic information regarding the product
    product_text = product_text_info(production_order.plan.product)
    par = Paragraph(product_text, text_style)
    elements.append(par)
    # elements.append(Spacer(1, 0.1 * inch))

    # heading = Paragraph("<b>Product Information</b>", styles["Heading3"])
    # elements.append(heading)

    # Add a spacer below the heading
    # elements.append(Spacer(1, 0.1 * inch))

    # Add the table to the document
    elements.append(product_frame)

    # elements.append(Spacer(1, 0.1 * inch))

    # MATERIAL INFORMATION HEADING
    heading = Paragraph("<b>Materials Information</b>", styles["Heading3"])
    elements.append(heading)
    
    # MATERIAL INFORMATION TABLE
    elements.append(material_frame)
    elements.append(Spacer(1, 0.1 * inch))
    
    # INVENTORY STATUS HEADING
    heading = Paragraph("<b>Inventory and production information for materials</b>", styles["Heading4"])
    elements.append(heading)

    # INVENTORY STATUS TABLE
    elements.append(inventory_frame)
    
    # PRODUCTION INFORMATION HEADING
    heading = Paragraph("<b>Production Information</b>", styles["Heading3"])
    elements.append(heading)

    # PRODUCTION INFORMATION TABLE
    elements.append(production_frame)

    # Build the PDF document
    doc.build(elements)
    return doc
    # pdf_data = pdf_buffer.getvalue()
    # pdf_buffer.close()
    # return pdf_data