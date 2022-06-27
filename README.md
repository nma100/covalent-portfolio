# Covalent Portfolio
This app is a crypto portfolio built with the Covalent API.

The user selects a blockchain and enters his wallet address. The application displays the list of assets owned by this user and its last transactions.

Live site: https://covalent-portfolio.vercel.app

Video demo:

The application uses the following Covalent endpoints:

- GET [/v1/{chain_id}/address/{address}/balances_v2](https://www.covalenthq.com/docs/api/#/0/Get%20historical%20portfolio%20value%20over%20time/USD/1): Retrieval of tokens and their balances
- GET [/v1/{chain_id}/address/{address}/transactions_v2](https://www.covalenthq.com/docs/api/#/0/Get%20transactions%20for%20address/USD/1): Retrieval of transactions

## Build

Install dependencies :
```
npm install
```

Create production build :
```
npm run build
```

Start development server :
```
npm start
```

## Libraries
The application is built with :  [Covalent API](https://www.covalenthq.com) [React](https://reactjs.org/), [Bootstrap](https://getbootstrap.com/)
