# Fire Faux (WIP)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

A simple and fast way to populate your Firebase Emulator with fake data.
Useful for developing and testing.

## Usage

Install package:

```sh
# npm
npm install firefaux

# yarn
yarn add firefaux

# pnpm
pnpm install firefaux
```

If you want to create random date, another package is required.
I recommend [fakerjs](https://fakerjs.dev/).

### Creating documents

You can define an document with `defineDocument`.

```ts
import * as ff from "firefaux";

type Product = {
  name: string;
  price: string;
  stock: number;
  provider: string;
};

const product = ff.defineDocument<Product>(() => {
  return {
    name: faker.commerce.productName(),
    price: faker.commerce.price({ min: 100, max: 800 }),
    stock: faker.number.int(100),
    provider: faker.company.name(),
  };
});
```

You can extend another document.

```ts
import * as ff from "firefaux";

const expansiveProduct = ff.extendDocument<Product>(product, () => {
  return {
    price: faker.commerce.price({ min: 1000, max: 8000 }),
    stock: faker.number.int(10),
  };
});
```

You can then create a document with `createDoc`.

```ts
ff.createDoc("products", product);
```

You can overwrite parts of the document definition.

```ts
ff.createDoc("products", product, {
  price: '10.00',
  name: "Cheap product",
});
```

If you need, you can set the document `id` by using the `_id` property.

```ts
ff.createDoc("products", product, {
  _id: "123"
});
```

You can also create multiple documents at once with `createMultipleDocs`

```ts
ff.createMultipleDocs("products", product, 20);
ff.createMultipleDocs("products", expansiveProduct, 5);
```


## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`

## License

Published under [MIT License](./LICENSE).

[npm-version-src]: https://img.shields.io/npm/v/firefaux?style=flat&colorA=241F31&colorB=FAA114
[npm-version-href]: https://npmjs.com/package/firefaux
[npm-downloads-src]: https://img.shields.io/npm/dm/firefaux?style=flat&colorA=241F31&colorB=FAA114
[npm-downloads-href]: https://npmjs.com/package/firefaux
