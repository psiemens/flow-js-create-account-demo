# Flow JavaScript Account Creation Demo

## Setup

To start, [install the Flow CLI](https://docs.onflow.org/flow-cli/install).

## Usage

### With a local emulator

Start the Flow Emulator:

```sh
flow project start-emulator -v
```

Generate a new key pair, 
create an account, 
and use it to send a transaction to the Emulator:

```sh
npm install
npm run demo
```

### With Flow Testnet

Generate a new key pair with the CLI:

```sh
flow keys generate
```

Use the public key to create an account with the [Flow Testnet faucet](https://testnet-faucet.onflow.org/).

Create `.env` file and fill in the following values, 
using the private key and account address from the previous step:

- `SIGNER_ADDRESS`
- `SIGNER_PRIVATE_KEY`

```sh
cp env.testnet.sample .env
```

Now install and run the demo:

```sh
npm install
npm run demo
```
