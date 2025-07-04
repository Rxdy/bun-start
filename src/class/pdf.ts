import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import puppeteer from "puppeteer";
import { directory } from "../class/directory";

class Pdf {
    async generateFromText(text: string): Promise<Buffer> {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        page.drawText(text || "Document vide");

        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }

    async generateFromHtml(html: string): Promise<Buffer> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });
        const buffer = await page.pdf({ format: "A4" });

        await browser.close();
        return buffer as Buffer;
    }

    async saveToFile(content: string, filePath: string): Promise<void> {
        const buffer = await this.generateFromText(content);
        await directory.writeBinaryFile(filePath, buffer);
    }

    async generate(content: string): Promise<Buffer> {
        return this.generateFromText(content);
    }
    async createInteractivePdf() {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);

        const form = pdfDoc.getForm();

        // Add fonts
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Draw a title
        page.drawText("Formulaire interactif", {
            x: 50,
            y: 750,
            size: 20,
            font,
            color: rgb(0, 0, 0),
        });

        // TEXT FIELD
        const textField = form.createTextField("name");
        textField.setText("Votre nom ici");
        textField.addToPage(page, { x: 50, y: 700, width: 200, height: 20 });

        // DATE FIELD (just a text field)
        const dateField = form.createTextField("date");
        dateField.setText("JJ/MM/AAAA");
        dateField.addToPage(page, { x: 50, y: 650, width: 200, height: 20 });

        // DROPDOWN (choice field)
        const dropdown = form.createDropdown("choices");
        dropdown.addOptions(["Option 1", "Option 2", "Option 3"]);
        dropdown.select("Option 1");
        dropdown.addToPage(page, { x: 50, y: 600, width: 200, height: 20 });

        // CHECKBOX
        const checkbox = form.createCheckBox("agree");
        checkbox.check();
        checkbox.addToPage(page, { x: 50, y: 550, width: 20, height: 20 });

        // DRAW SKETCH AREA
        page.drawRectangle({
            x: 50,
            y: 400,
            width: 300,
            height: 200,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        page.drawText("Zone de croquis (dessin libre)", {
            x: 55,
            y: 590,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
}

export const pdf = new Pdf();
