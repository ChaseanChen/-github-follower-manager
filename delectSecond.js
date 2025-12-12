// === GitHub Smart Auto-Unfollow Script ===
async function safeAutoUnfollow() {
  // 1. Get Token
  const token = prompt("Step 1: Please paste your Token (starts with ghp_):");
  if (!token) return alert("Cannot run without a Token!");
  
  const username = prompt("Step 2: Your username:");
  if (!username) return;

  // 2. Whitelist
  const defaultWhiteList = "sindresorhus,torvalds,ruanyf,yyx990803,antfu,gaearon,tj,rauchg,Rich-Harris,posva,sdras,kentcdodds,getify,feross,addyosmani,paulirish,mdo,fat,defunkt,mojombo,kennethreitz,mitsuhiko,tiangolo,dhh,taylorotwell,fabpot,kelvins,jwasham,donnemartin,vinta,kamranahmedse,trekhleb,koush,gabrielfalcao,FredKSchott,akien-mga,Dreamacro,DIYgod,jaywcjlove,surmon-china,phodal,fouber,sofish,lifesinger,alsotang,dead-horse,fengmk2,atian25,microsoft,google,facebook,apple,netflix,airbnb,twitter,alibaba,tencent,baidu,bytedance,huawei,xiaomi,vuejs,reactjs,angular,vercel,nextjs,nestjs,expressjs,fastify,pytorch,tensorflow,huggingface,openai,deepmind,ultralytics,optuna,karpathy,ggerganov,automattic,electron,atom,docker,kubernetes,ansible,hashicorp,mitchellh,clowwindy,fatedier,junegunn,neovim,vim,rust-lang,golang,python,nodejs,denoland,ry,whatwg,w3c,linux,git,github,labuladong,azl397985856,halfrost,keon,lemire,skeeto,MisterBooo,youngyangyang04,kdn251,TheAlgorithms";
  const whiteListInput = prompt("Step 3: Whitelist (Default list of top developers is pre-filled, press Enter to keep):", defaultWhiteList);
  const whiteList = new Set(whiteListInput.split(",").map(s => s.trim()));

  console.clear();
  console.log(`🚀 [Safe Mode] Scanning following list for ${username}...`);

  const headers = { "Authorization": `token ${token}`, "Accept": "application/vnd.github.v3+json" };

  // Helper function to fetch all data
  async function getAll(type) {
    let list = [];
    let page = 1;
    while (true) {
      console.log(`📡 Reading ${type} page ${page}...`);
      let res = await fetch(`https://api.github.com/users/${username}/${type}?per_page=100&page=${page}`, { headers });
      if (!res.ok) throw new Error(`API Limit or Token Error: ${res.status}`);
      let data = await res.json();
      if (data.length === 0) break;
      list = list.concat(data);
      page++;
      // Pause slightly between pages to prevent reading too fast
      await new Promise(r => setTimeout(r, 1000));
    }
    return list;
  }

  try {
    const following = await getAll("following");
    const followers = await getAll("followers");
    
    // Find those who don't follow back
    const followerLogins = new Set(followers.map(u => u.login));
    const nonMutuals = following.filter(u => !followerLogins.has(u.login));
    
    // Exclude whitelist
    const toDelete = nonMutuals.filter(u => !whiteList.has(u.login));

    console.log(`\n=== 📊 Analysis Report ===`);
    console.log(`You follow: ${following.length}`);
    console.log(`Follows you: ${followers.length}`);
    console.log(`Not following back: ${nonMutuals.length}`);
    console.log(`🛡️ Whitelist protection: ${nonMutuals.length - toDelete.length} users`);
    console.log(`🗑️ To be removed: ${toDelete.length} users`);

    if (toDelete.length === 0) return alert("Your list is very clean! No cleanup needed.");

    // Estimate time
    const minTime = (toDelete.length * 5 / 60).toFixed(1);
    const maxTime = (toDelete.length * 12 / 60).toFixed(1);
    
    const confirm = prompt(`⚠️ Ready to remove ${toDelete.length} users.\n\nTo protect the account, a [5~12 seconds random delay] strategy will be used.\nEstimated time: ${minTime} ~ ${maxTime} minutes.\n\nPlease [DO NOT CLOSE THIS PAGE] while the script runs. You can switch tabs to do other things.\n\nType "yes" to start safe cleanup:`);
    
    if (confirm !== "yes") return console.log("Operation cancelled.");

    // === Start Loop ===
    let count = 0;
    for (const user of toDelete) {
      count++;
      
      // Generate random number between 5000ms and 12000ms
      const randomDelay = Math.floor(Math.random() * (12000 - 5000 + 1) + 5000);
      
      console.log(`\n⏳ [${count}/${toDelete.length}] Waiting for random cooldown (${(randomDelay/1000).toFixed(1)}s)...`);
      
      // Wait for random time
      await new Promise(r => setTimeout(r, randomDelay));

      console.log(` Unfollowing: ${user.login} `);
      const res = await fetch(`https://api.github.com/user/following/${user.login}`, {
        method: "DELETE",
        headers: headers
      });

      if (res.status === 204) {
        console.log(` Success (${user.login}) `);
      } else {
        console.error(` Failed (${user.login}) Status Code: ${res.status} `);
        // Stop if 403 or 429 errors occur, indicating rate limiting
        if (res.status === 403 || res.status === 429) {
          alert(" GitHub warning: operation too fast. Script stopped immediately! Please try again tomorrow.");
          break;
        }
      }
    }

    alert("🎉 All cleanup tasks completed!");

  } catch (err) {
    console.error(err);
    alert(" An error occurred, please check the console.");
  }
}

safeAutoUnfollow();