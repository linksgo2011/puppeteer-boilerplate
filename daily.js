const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');
const qpdf = require('node-qpdf');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${process.cwd()}/daily.html`, {waitUntil: 'networkidle2'});
    await page.pdf({path: 'daily.pdf', format: 'A4'});
    await page.pdf({path: 'daily2.pdf', format: 'A4'});
    await browser.close();

    // merge pdf
    merge(['daily.pdf', 'daily2.pdf'], 'daily_all.pdf', function(err){
        if(err) {
            return console.log(err)
        }
        console.log('Successfully merged!')

        // encrypt
        qpdf.encrypt('daily_all.pdf','123456');
    });
})();
