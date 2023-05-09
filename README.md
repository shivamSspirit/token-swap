# learn spl token swap using this example project

## 🎬 Recorded Sessions
| Link | Instructor | Event |
| ---- | ---------- | ----- |
| Recording coming soon | - | - |

## What is spl-token-swap program ?

The Token Swap Program allows simple trading of token pairs without a centralized limit order book. The program uses a mathematical formula called "curve" to calculate the price of all trades.

## 🔧 Dependencies

To follow along in this tutorial, you are going to need:

- Basic knowledge of Javascript and React
- Node JS
- NPM/Yarn
- A web browser, which you probably have if you're reading this.
  Now that this is out of the way, let's get to the fun part!

## 📗 What are we going to learn ?

By the end of this course, you're gonna build a token swap example, using the instruction you will end up with how to 

* depositing liquidity to the pool
* withdrawing your deposited liquidity
* swapping from one token to the other

---

- **1. Getting started with Token Swap**
  - 1.1 - Installing dependency
  - 1.2 - Airdrop tokens in token accounts
  - 1.3 - deposit liquidity to the pool
  - 1.4 - withdraw your deposited liquidity
  - 1.5 - swapping from Alice token to the Bob token
  

This looks like a lot, but trust me, it isn't. You're going to understand all of this pretty fast.

---

**1. Getting started with Token swap**
**1.1 - Installing spl-token-swap**
**1.2 - Installing spl-token**
**1.3 - Installing solana/wallet-adapter-react-ui**
**1.4 - Installing solana/wallet-adapter-wallets**
**1.5 - Installing project-serum/borsh**
**1.6 - Installing chakra-ui/react**

To installing these dependency, you are going to have to download using npm or yarn for this project we using npm.

###
In this program we are using hooks like useWallet and useConnection for using wallet and web3 connection
also we utilize the TokenSwap, TOKEN_SWAP_PROGRAM_ID, TOKEN_PROGRAM_ID for interacting with swap pool
we are importing these from our installed dependency
###



**1.2 - Creating the Airdrop Program**
utilize this airdrop program that's deployed on Devnet at address CPEV4ibq2VUv7UnNpkzUGL82VRzotbv2dy8vGwRfh3H3. You can mint as many tokens as you'd like to your wallet to interact with the pool.

```ts 
export class AirdropSchema {
    amount: number

    constructor(amount: number) {
        this.amount = amount
    }

    AIRDROP_IX_DATA_LAYOUT = borsh.struct([
        borsh.u8("variant"),
        borsh.u32("amount"),
    ])

    serialize(): Buffer {
        const payload = {
            variant: 0,
            amount: this.amount,
        }

        const ixBuffer = Buffer.alloc(9)
        this.AIRDROP_IX_DATA_LAYOUT.encode(payload, ixBuffer)

        return ixBuffer
    }
}
```

**1.2.1 - utilize this Airdrop Program to mint token in Alice token account and Bob token account both token program will be used to interact with pool**

```ts
 const handleAliceTransactionSubmit = async (airdrop: AirdropSchema) => {
        if (!publicKey) {
            alert("Please connect your wallet!")
            return
        }
        const transaction = new Web3.Transaction()

        const userATA = await token.getAssociatedTokenAddress(
            AliceMint,
            publicKey
        )
        let account = await connection.getAccountInfo(userATA)

        if (account == null) {
            const createATAIX =
                await token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    userATA,
                    publicKey,
                    AliceMint
                )
            transaction.add(createATAIX)
        }

        const buffer = airdrop.serialize()

        const airdropIX = new Web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: true,
                },
                {
                    pubkey: userATA,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: AliceMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: airdropPDA,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: token.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            data: buffer,
            programId: airdropProgramId,
        })

        transaction.add(airdropIX)
}
```

```ts
const handleBobTransactionSubmit = async (airdrop: AirdropSchema) => {
        if (!publicKey) {
            alert("Please connect your wallet!")
            return
        }
        const transaction = new Web3.Transaction()

        const userATA = await token.getAssociatedTokenAddress(
            BobCoinMint,
            publicKey
        )
        let account = await connection.getAccountInfo(userATA)

        if (account == null) {
            const createATAIX =
                await token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    userATA,
                    publicKey,
                    BobCoinMint
                )
            transaction.add(createATAIX)
        }

        const buffer = airdrop.serialize()

        const airdropIX = new Web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: true,
                },
                {
                    pubkey: userATA,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: BobCoinMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: airdropPDA,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: token.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            data: buffer,
            programId: airdropProgramId,
        })

        transaction.add(airdropIX)
}
```

**1.2.2 - utilizing these instruction we pass the amount of tokens we need to mint to these handlers(Alice token handler and Bob token handler)**


**1.2.3 - in these handler instruction we use some accounts for a
successful airdrop
```ts 
export const AliceMint = new Web3.PublicKey(
    "DWiD4EVUtnsgqoGbdSK5kBjHRJ7XoGx58WPHBu7t73Dh"
)

export const BobCoinMint = new Web3.PublicKey(
    "4AG5yRYmMcpMxcRvvkLPHHiSdnCnRQhtncs79CoQNnRQ"
)

export const airdropProgramId = new Web3.PublicKey(
    "CPEV4ibq2VUv7UnNpkzUGL82VRzotbv2dy8vGwRfh3H3"
)

export const airdropPDA = new Web3.PublicKey(
    "99ynLfSvcRXwYMKv4kmbcAyGxhfD7KfgrsuHTx9Dvoot"
)
```
**

**1.3 - deposit liquidity to the pool **

for depositing liquidity to the swap pool we need some account and instruction



```ts
export const AliceMint = new Web3.PublicKey(
    "DWiD4EVUtnsgqoGbdSK5kBjHRJ7XoGx58WPHBu7t73Dh"
)

export const BobCoinMint = new Web3.PublicKey(
    "4AG5yRYmMcpMxcRvvkLPHHiSdnCnRQhtncs79CoQNnRQ"
)

export const tokenSwapStateAccount = new Web3.PublicKey(
    "EV7FEEq2EyTFtKx4ukp2QfW9mWLGcJckGGBNp5cjcHUe"
)

export const swapAuthority = new Web3.PublicKey(
    "24zqZMTYLVk4gm62seqU7KhBwvi3uBGtyDbnsC4rkbuR"
)

export const poolAliceAccount = new Web3.PublicKey(
    "BVPUZrv5nk3jMyTWkZdxvp2LuyPF1DmGTyR8AzKvgZgN"
)

export const poolBobAccount = new Web3.PublicKey(
    "5ttkBtMndCbHdSib22K4wRUE5ifprPXkMSckzBRSQv3K"
)

export const poolMint = new Web3.PublicKey(
    "CXQYDT9ShDYG1JMMwjNiR6TcL4u4uJNnguAbLKw6jVv4"
)
```
after importing these in Deposit component we can use these to initiate instruction for depositing liquidity

```ts
const handleTransactionSubmit = async () => {
        if (!publicKey) {
            alert("Please connect your wallet!")
            return
        }

        const poolMintInfo = await token.getMint(connection, poolMint)

        const AliceATA = await token.getAssociatedTokenAddress(
            AliceMint,
            publicKey
        )
        const BobATA = await token.getAssociatedTokenAddress(
            BobCoinMint,
            publicKey
        )
        const tokenAccountPool = await token.getAssociatedTokenAddress(
            poolMint,
            publicKey
        )   

        const transaction = new Web3.Transaction()

        let account = await connection.getAccountInfo(tokenAccountPool)

        if (account == null) {
            const createATAInstruction =
                token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    tokenAccountPool,
                    publicKey,
                    poolMint
                )
            transaction.add(createATAInstruction)
        }

        const instruction = TokenSwap.depositAllTokenTypesInstruction(
            tokenSwapStateAccount,
            swapAuthority,
            publicKey,
            AliceATA,
            BobATA,
            poolAliceAccount,
            poolBobAccount,
            poolMint,
            tokenAccountPool,
            TOKEN_SWAP_PROGRAM_ID,
            token.TOKEN_PROGRAM_ID,
            poolTokenAmount * 10 ** poolMintInfo.decimals,
            100e9,
            100e9
        )
         transaction.add(instruction)
}
```
**1.4 - withdraw your deposited liquidity **

for withdrawing liquidity from the swap pool we need some account and instruction

```ts
export const AliceMint = new Web3.PublicKey(
    "DWiD4EVUtnsgqoGbdSK5kBjHRJ7XoGx58WPHBu7t73Dh"
)

export const BobCoinMint = new Web3.PublicKey(
    "4AG5yRYmMcpMxcRvvkLPHHiSdnCnRQhtncs79CoQNnRQ"
)

export const tokenSwapStateAccount = new Web3.PublicKey(
    "EV7FEEq2EyTFtKx4ukp2QfW9mWLGcJckGGBNp5cjcHUe"
)

export const swapAuthority = new Web3.PublicKey(
    "24zqZMTYLVk4gm62seqU7KhBwvi3uBGtyDbnsC4rkbuR"
)

export const poolAliceAccount = new Web3.PublicKey(
    "BVPUZrv5nk3jMyTWkZdxvp2LuyPF1DmGTyR8AzKvgZgN"
)

export const poolBobAccount = new Web3.PublicKey(
    "5ttkBtMndCbHdSib22K4wRUE5ifprPXkMSckzBRSQv3K"
)

export const poolMint = new Web3.PublicKey(
    "CXQYDT9ShDYG1JMMwjNiR6TcL4u4uJNnguAbLKw6jVv4"
)

export const feeAccount = new Web3.PublicKey(
    "EY4hgx73saq9xuLr85HNaxGMAK6R5TkvuSDchKbpt291"
)
```

after importing these in withdraw component we can use these to initiate instruction for withdrawing liquidity

```ts
 const handleTransactionSubmit = async () => {
        if (!publicKey) {
            alert("Please connect your wallet!")
            return
        }

        const poolMintInfo = await token.getMint(connection, poolMint)

        const AliceATA = await token.getAssociatedTokenAddress(
            AliceMint,
            publicKey
        )
        const BobATA = await token.getAssociatedTokenAddress(
            BobCoinMint,
            publicKey
        )
        const tokenAccountPool = await token.getAssociatedTokenAddress(
            poolMint,
            publicKey
        )

        const transaction = new Web3.Transaction()

        let account = await connection.getAccountInfo(tokenAccountPool)

        if (account == null) {
            const createATAInstruction =
                token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    tokenAccountPool,
                    publicKey,
                    poolMint
                )
            transaction.add(createATAInstruction)
        }

        const instruction = TokenSwap.withdrawAllTokenTypesInstruction(
            tokenSwapStateAccount,
            swapAuthority,
            publicKey,
            poolMint,
            feeAccount,
            tokenAccountPool,
            poolAliceAccount,
            poolBobAccount,
            AliceATA,
            BobATA,
            TOKEN_SWAP_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            poolTokenAmount * 10 ** poolMintInfo.decimals,
            0,
            0
        )

        transaction.add(instruction)
 }
```

**1.5 - swapping from Alice token to the Bob token **

for swapping from Alice token to the Bob token we need some accounts and instruction

```ts
export const AliceMint = new Web3.PublicKey(
    "DWiD4EVUtnsgqoGbdSK5kBjHRJ7XoGx58WPHBu7t73Dh"
)

export const BobCoinMint = new Web3.PublicKey(
    "4AG5yRYmMcpMxcRvvkLPHHiSdnCnRQhtncs79CoQNnRQ"
)

export const tokenSwapStateAccount = new Web3.PublicKey(
    "EV7FEEq2EyTFtKx4ukp2QfW9mWLGcJckGGBNp5cjcHUe"
)

export const swapAuthority = new Web3.PublicKey(
    "24zqZMTYLVk4gm62seqU7KhBwvi3uBGtyDbnsC4rkbuR"
)

export const poolAliceAccount = new Web3.PublicKey(
    "BVPUZrv5nk3jMyTWkZdxvp2LuyPF1DmGTyR8AzKvgZgN"
)

export const poolBobAccount = new Web3.PublicKey(
    "5ttkBtMndCbHdSib22K4wRUE5ifprPXkMSckzBRSQv3K"
)

export const poolMint = new Web3.PublicKey(
    "CXQYDT9ShDYG1JMMwjNiR6TcL4u4uJNnguAbLKw6jVv4"
)

export const feeAccount = new Web3.PublicKey(
    "EY4hgx73saq9xuLr85HNaxGMAK6R5TkvuSDchKbpt291"
)
```

after importing these in Swap component we can use these to initiate instruction for swap tokens

```ts
 const handleTransactionSubmit = async () => {
        if (!publicKey) {
            alert("Please connect your wallet!")
            return
        }

        const AliceMintInfo = await token.getMint(connection, AliceMint)
        const BobCoinMintInfo = await token.getMint(
            connection,
            BobCoinMint
        )

        const AliceATA = await token.getAssociatedTokenAddress(
            AliceMint,
            publicKey
        )
        const BobATA = await token.getAssociatedTokenAddress(
            BobCoinMint,
            publicKey
        )
        const tokenAccountPool = await token.getAssociatedTokenAddress(
            poolMint,
            publicKey
        )

        const transaction = new Web3.Transaction()

        let account = await connection.getAccountInfo(tokenAccountPool)

        if (account == null) {
            const createATAInstruction =
                token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    tokenAccountPool,
                    publicKey,
                    poolMint
                )
            transaction.add(createATAInstruction)
        }

        if (mint == "option1") {
            const instruction = TokenSwap.swapInstruction(
                tokenSwapStateAccount,
                swapAuthority,
                publicKey,
                AliceATA,
                poolAliceAccount,
                poolBobAccount,
                BobATA,
                poolMint,
                feeAccount,
                null,
                TOKEN_SWAP_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                amount * 10 ** AliceMintInfo.decimals,
                0
            )

            transaction.add(instruction)
        } else if (mint == "option2") {
            const instruction = TokenSwap.swapInstruction(
                tokenSwapStateAccount,
                swapAuthority,
                publicKey,
                BobATA,
                poolBobAccount,
                poolAliceAccount,
                AliceATA,
                poolMint,
                feeAccount,
                null,
                TOKEN_SWAP_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                amount * 10 ** BobCoinMintInfo.decimals,
                0
            )

            transaction.add(instruction)
        }
 }
```

in this we use two options
for option one we use Alice token and for second option we use Bob token





