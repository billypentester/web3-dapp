const express = require('express')
const path = require('path')
const hbs = require('hbs')
const Web3 = require('web3')
const hre = require("hardhat");
var Contract = require('web3-eth-contract');
const hardhat = require('./artifacts/Contracts/Election.sol/Election.json') 

const app = express()
const port = 3000

app.locals.address = ''
const abi = hardhat.abi


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

async function myContract()
{
    const contract = await hre.ethers.getContractFactory("Election");
    return contract;
}

myContract().then(function(contract) { console.log(contract.interface.deploy) })


app.get('/', async(req, res) => {

    try{
        const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
        Contract.setProvider('HTTP://127.0.0.1:7545')

        const contract = new Contract(abi,"0xFb10292204Be94B618818C0bFFAAFe2f2476baC1")

        contract.methods.candidateName().call().then(function(result) {
            res.status(200).render('index', {
                candidate: result,
                address: app.locals.address
            })
        })

    }
    catch(err) {
        res.status(404).render('error',{ msg : "Provider not initialized" })
    }

})

app.post('/update', (req, res) => {

    const { fname, address } = req.body

    console.log(fname, address)

    if(fname === '') {
        res.status(404).render('error', { msg : "Owner name is required" })
    }
    else if(address === '') {
        res.status(404).render('error', { msg : "Connect metamask wallet. Sender address is required" })
    }
    else
    {
        const contract = new Contract(abi,"0xFb10292204Be94B618818C0bFFAAFe2f2476baC1")
        contract.methods.setCandidate(fname).send({from: address})
        .then(function(receipt){
            console.log(receipt)
            res.redirect('/')
        })
        .catch(function(err){
            console.log(err)
            res.status(200).render('error', { msg : "sender is not registered in blockchain" })
        })
    }

    

})

app.get('/setup', (req, res) => {

    const address = req.query.wallet
    app.locals.address = address

    console.log(app.locals.address)

    res.redirect('/')

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})