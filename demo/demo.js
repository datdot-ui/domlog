const bel = require('bel')
const csjs = require('csjs-inject')
const domlog = require('..')
const button = require('datdot-ui-button')
const path = require('path')
const filename = path.basename(__filename)

function demoComponent() {
    let recipients = []
    // Demo init log
    const log = domlog({page: 'demo', from: 'demo', flow: 'ui-domlog', type: 'init', body: 'ready', filename, line: 11})
    // elements
    const cancel = button({page: 'dmeo', name: 'cancel', content: 'Cancel', style: 'solid', color: 'white'}, protocol('cancel'))
    const confirm = button({page: 'dmeo', name: 'confirm', content: 'Confirm', style: 'solid', color: 'dark'}, protocol('confirm'))
    // content
    const content = bel`
    <div class=${css.content}>
        <h1>UI Domlog Demo</h1>
        <div>${cancel} ${confirm}</div>
    </div>`
    // show logs
    let terminal = bel`<div class=${css.terminal}></div>`
    terminal.append(log)
    // container
    const container = wrap(content, terminal)
    return container

    function wrap (content) {
        const container = bel`
        <div class=${css.wrap}>
            <section class=${css.container}>
                ${content}
            </section>
            ${terminal}
        </div>
        `
        return container
    }

    function protocol(name) {
        return send => {
            recipients[name] = send
            return function receiveClick(message) {
                sendMessage(message).then( log =>  { 
                    terminal.append(log) 
                    terminal.scrollTop = terminal.scrollHeight
                })
            }
        }
    }

    async function sendMessage (message) {
        return await new Promise( (resolve, reject) => {
            if (message === undefined) reject('no message import')
            const log = domlog(message)
            return resolve(log)
        }).catch( err => { throw new Error(err) } )
    }
}


const css = csjs`
html {
    box-sizing: border-box;
}
*, *::before, *::after {
    box-sizing: inherit;
}
body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    background-color: rgba(0, 0, 0, .1);
    height: 100%;
}
.wrap {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 75vh 25vh;
}
.container {
    padding: 25px;
    overflow-y: auto;
}
.container > div {
    margin-bottom: 20px;
}
.container > div button {
    margin-right: 10px;
}
.content {}
.terminal {
    background-color: #212121;
    color: #f2f2f2;
    font-size: 13px;
    overflow-y: auto;
}
`

document.body.append( demoComponent() )