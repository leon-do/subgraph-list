const axios = require("axios");
const fs = require("fs");

main();
async function main() {
  let skip = 0;
  let subgraphs = [];
  let length = 1;
  while (length > 0) {
    const response = await fetch(skip);
    subgraphs = [...subgraphs, ...response];
    length++;
    skip += 300;
    length = response.length;
    console.log({ currentLength: length, subgraphLength: subgraphs.length });
  }

  subgraphs = subgraphs
    .map((subgraph) => {
      return {
        id: subgraph.id,
        name: subgraph.displayName,
        website: subgraph.website,
        fees: subgraph.currentVersion.subgraphDeployment.queryFeesAmount,
      };
    })
    .sort((a, b) => parseInt(b.fees) - parseInt(a.fees));

  fs.writeFileSync("./README.md", JSON.stringify(subgraphs, null, 2));
}

async function fetch(skip) {
  const url =
    "https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-mainnet";
  const query = `
      query {
          subgraphs (skip: ${skip}, first: 300) {
            id
            displayName
            website
            currentVersion {
              subgraphDeployment {
                queryFeesAmount
              }
            }
          }
        }
      `;
  const { data } = await axios.post(url, { query });
  return data.data.subgraphs;
}
