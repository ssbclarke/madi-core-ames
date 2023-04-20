import puppeteer from 'puppeteer-extra'; 
 
// Add stealth plugin and use defaults 
import pluginStealth from 'puppeteer-extra-plugin-stealth'; 
// const puppeteer = require('puppeteer'); 
 
// Use stealth 
puppeteer.use(pluginStealth()); 

//Import your executablePath
// const executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'; // Replace this with the path to your Chrome executable
 
// Launch pupputeer-stealth 
puppeteer.launch({ 
    headless:true,
    args: [
        '--use-gl=egl',
        '--no-sandbox',
        '--single-process',
        '--disable-web-security',
        '--disable-dev-profile'
    ],
}).then(async browser => { 
    // Create a new page 
    const page = await browser.newPage(); 
 
    // Setting page view 
    await page.setViewport({ width: 1280, height: 720 }); 
 


    // ARCHIVE.IS SEARCH
    // Go to the website 
    await page.goto('https://archive.is/https:/www.nytimes.com/2023/01/11/opinion/geoengineering-climate-change-solar.html');

    await page.waitForSelector('#row0')
    let archiveLink = await page.$eval('#row0 a', el => el.href)
 
    await page.goto(archiveLink); 

    await page.waitForNetworkIdle()
    await page.content()

    let text = await page.evaluate(() => { 
        return document.querySelector('body').textContent; 
    });
 
    console.log(text)
    // print out the results 
    // console.log(title, '\n', msg, '\n', state); 
 
    await browser.close(); 
});
