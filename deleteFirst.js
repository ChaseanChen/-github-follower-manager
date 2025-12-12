// === Auto-Unfollow Script (Fast Mode) ===
async function autoUnfollow() {
  // 1. Get Input Information
  const token = prompt("Step 1: Please paste the Token generated earlier (starts with ghp_):");
  if (!token) return alert("Cannot delete without a Token!");
  
  const username = prompt("Step 2: Please enter your username:");
  if (!username) return;

  const whiteListInput = prompt("Step 3 (Optional): Enter whitelisted usernames to keep, separated by commas (e.g., user1,user2):", "");
  const whiteList = new Set(whiteListInput ? whiteListInput.split(",") : []);

  console.clear();
  console.log(` Starting scan for non-mutual followers of ${username}...`);

  // 2. Prepare Headers
  const headers = {
    "Authorization": `token ${token}`,
    "Accept": "application/vnd.github.v3+json"
  };

  // 3. Fetch Data
  async function getAll(type) {
    let list = [];
    let page = 1;
    while (true) {
      console.log(`Reading ${type} page ${page}...`);
      let res = await fetch(`https://api.github.com/users/${username}/${type}?per_page=100&page=${page}`, { headers });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      let data = await res.json();
      if (data.length === 0) break;
      list = list.concat(data);
      page++;
    }
    return list;
  }

  try {
    const following = await getAll("following");
    const followers = await getAll("followers");
    
    // Find non-mutuals
    const followerLogins = new Set(followers.map(u => u.login));
    const nonMutuals = following.filter(u => !followerLogins.has(u.login));

    // Filter whitelist
    const toDelete = nonMutuals.filter(u => !whiteList.has(u.login));

    console.log(`\n=== Scan Results ===`);
    console.log(`You follow: ${following.length}`);
    console.log(`Follows you: ${followers.length}`);
    console.log(`Not following back: ${nonMutuals.length}`);
    console.log(`Ready to unfollow: ${toDelete.length} users (Whitelist excluded)`);

    if (toDelete.length === 0) return alert("Congratulations! Your following list is clean, no non-mutuals.");

    // 4. Final Confirmation
    const confirm = prompt(`⚠️ WARNING: About to auto-unfollow ${toDelete.length} users!\n\nTo prevent ban, script pauses for 2 seconds per user.\n\nType "yes" to start, type anything else to cancel:`);
    if (confirm !== "yes") return console.log("Operation cancelled.");

    // 5. Start Deletion Loop
    let count = 0;
    for (const user of toDelete) {
      count++;
      console.log(`[${count}/${toDelete.length}] Unfollowing: ${user.login} ...`);
      
      const res = await fetch(`https://api.github.com/user/following/${user.login}`, {
        method: "DELETE",
        headers: headers
      });

      if (res.status === 204) {
        console.log(` Unfollow success: ${user.login}`);
      } else {
        console.error(` Unfollow failed: ${user.login} (Status code: ${res.status})`);
      }

      // === Key: Anti-ban Delay (2000ms = 2 seconds) ===
      await new Promise(r => setTimeout(r, 2000));
    }

    alert("🎉 All cleanup completed!");

  } catch (err) {
    console.error(err);
    alert("Error occurred. Check console red text. Usually due to wrong or expired Token.");
  }
}

autoUnfollow();