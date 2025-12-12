# GitHub Mutual Follow Check & Auto-Cleanup Tool (GitHub Follower Manager)

This is a collection of JavaScript scripts running in the browser console. It helps you analyze GitHub follow relationships, identify users who **"you follow but they don't follow back"** (Non-mutuals), and provides safe batch unfollow functionality.

> ⚠️ **Risk Warning**: Any automated operation runs the risk of being flagged as a Bot by GitHub. This tool provides a **Random Delay** mode to minimize risks, but please do not rush!

---

## Step 1: Preparation

### 1. Open Browser Console
Open your [GitHub Homepage](https://github.com/) in Chrome, Edge, or Firefox. Press the **`F12`** key (or right-click page -> "Inspect"), and switch to the **Console** tab.

> **Note**: If this is your first time pasting code into the console, the browser might block it with a warning.
> *   **Solution**: Manually type `allow pasting` in the console and hit Enter, then try pasting the code again.

### 2. Get GitHub Access Token (Required)
To allow the script to read follow lists and perform unfollow actions, you need a Token.

1.  Click here: [Generate New Token (Classic)](https://github.com/settings/tokens/new)
2.  **Note**: Fill in anything (e.g., `Cleanup Script`).
3.  **Expiration**: Suggested **7 days** (Delete after use for security).
4.  **Select scopes**:
    *    Check the **`user:follow`** option under **`user`** (This is the core permission).
5.  Click the green **Generate token** button at the bottom.
6.   **Copy** the generated long string starting with `ghp_` (This is your only chance to copy it).

---

## Step 2: Non-Destructive Check (View Only, No Deletion)

If you only want to know who hasn't followed you back without deleting anyone, use this script.

*   **Script File**: `list.js`
*   **Method**: Copy the full code of `list.js`, paste it into the console, and hit Enter.
*   **Features**:
    *   No Token needed (uses public API, may have rate limits).
    *   After running, it lists all non-mutual users in a **Table Format** in the console with profile links.

---

## Step 3: Execute Cleanup (Choose One)

Please choose a mode based on your needs. **Mode A is highly recommended.**

### 🌟 Mode A: Smart Safe Mode (Recommended)
*   **Script File**: `delectSecond.js` (Filename typo, actually means delete)
*   **Features**:
    *    **Human Simulation**: Random interval of **5~12 seconds** between deletions to simulate human behavior.
    *    **Built-in Whitelist**: Pre-filled list of famous developers to prevent accidental unfollowing of tech giants.
    *    **Circuit Breaker**: Automatically stops upon encountering GitHub warnings (403/429).
    *    **Time Estimation**: Calculates estimated time before running.
*   **Best For**: Users with many people to clean up who value account safety.

### Mode B: Fast Mode (Use with Caution)
*   **Script File**: `deleteFirst.js`
*   **Features**:
    *    **Fixed Delay**: Pauses only 2 seconds per deletion.
    *    **Faster**: Suitable for cleaning up fewer than 20 people.
*   **Warning**: If you clean hundreds of people, using this script is very likely to cause your account to be temporarily restricted (Shadowban).

---

## Appendix: Recommended Whitelist

Some users are open-source giants or official organizations; they usually don't follow back normal users. To avoid accidental deletion, it is recommended to copy the following list when prompted for a "Whitelist":

**📦 All-in-One Pack (Copy this block):**
```text
sindresorhus,torvalds,ruanyf,yyx990803,antfu,gaearon,tj,rauchg,Rich-Harris,posva,sdras,kentcdodds,getify,feross,addyosmani,paulirish,mdo,fat,defunkt,mojombo,kennethreitz,mitsuhiko,tiangolo,dhh,taylorotwell,fabpot,kelvins,jwasham,donnemartin,vinta,kamranahmedse,trekhleb,koush,gabrielfalcao,FredKSchott,akien-mga,Dreamacro,DIYgod,jaywcjlove,surmon-china,phodal,fouber,sofish,lifesinger,alsotang,dead-horse,fengmk2,atian25,microsoft,google,facebook,apple,netflix,airbnb,twitter,alibaba,tencent,baidu,bytedance,huawei,xiaomi,vuejs,reactjs,angular,vercel,nextjs,nestjs,expressjs,fastify,pytorch,tensorflow,huggingface,openai,deepmind,ultralytics,optuna,karpathy,ggerganov,automattic,electron,atom,docker,kubernetes,ansible,hashicorp,mitchellh,clowwindy,fatedier,junegunn,neovim,vim,rust-lang,golang,python,nodejs,denoland,ry,whatwg,w3c,linux,git,github,labuladong,azl397985856,halfrost,keon,lemire,skeeto,MisterBooo,youngyangyang04,kdn251,TheAlgorithms
```

---

## ❓ Q&A

**Q: Why do I get a red error `401 Unauthorized`?**
A: Your Token is wrong or expired. Please regenerate and ensure you paste the full string.

**Q: Why does it stop halfway with `403 Forbidden` or `429 Too Many Requests`?**
A: Your operation is too fast, triggering GitHub's anti-crawler mechanism.
*   **Solution**: The script stops automatically. Please **stop immediately**, close the page, and wait 2-24 hours before trying again.

**Q: What should I do after cleanup?**
A: For account security, it is recommended to go back to GitHub's Tokens settings page and **Delete** the token you just created.
