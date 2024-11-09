const patientName = "John Mike"

export const samplePdf = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient: ${patientName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            background-color: #f9f9f9;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
        }

        .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
        }

        .header h1 {
            margin: 0;
            color: #007bff;
            font-size: 24px;
        }

        .content {
            padding: 20px 0;
        }

        .content h2 {
            font-size: 20px;
            color: #333;
            margin-bottom: 10px;
        }

        .content p {
            margin-bottom: 15px;
            line-height: 1.6;
        }

        .content .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .content .table th, .content .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        .content .table th {
            background-color: #f2f2f2;
        }

        .footer {
            text-align: center;
            padding: 10px 0;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #999;
        }

        .footer p {
            margin: 0;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Patient Case Record: ${patientName}</h1>
    </div>

    <div class="content">
        <h2>Report Title</h2>
        <p>This is a sample paragraph for your PDF export. You can include any text content, formatted with paragraphs, headings, and tables.</p>
        
        <h2>Data Table</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Item 1</td>
                    <td>Sample description 1</td>
                    <td>10</td>
                    <td>$100</td>
                </tr>
                <tr>
                    <td>Item 2</td>
                    <td>Sample description 2</td>
                    <td>5</td>
                    <td>$50</td>
                </tr>
                <tr>
                    <td>Item 3</td>
                    <td>Sample description 3</td>
                    <td>2</td>
                    <td>$25</td>
                </tr>
            </tbody>
        </table>

        <p>You can add more sections here as needed for your PDF export.</p>
    </div>

    <div class="footer">
        <p>Exported on: <span id="exportDate"></span></p>
    </div>
</div>

<script>
    document.getElementById('exportDate').textContent = new Date().toLocaleDateString();
</script>

</body>
</html>

`;
