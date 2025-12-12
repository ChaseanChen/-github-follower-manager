// === Start Copying ===
async function findNonMutuals() {
  // 1. Prompt for your username
  const username = prompt("Please enter your GitHub username (e.g., torvalds):");
  if (!username) return;

  console.clear();
  console.log(`🚀 Scanning data for ${username}... Please keep this page open.`);

  // 2. Get Following List
  let following = [];
  let page = 1;
  while (true) {
    // Fetch 100 per page
    let res = await fetch(`https://api.github.com/users/${username}/following?per_page=100&page=${page}`);
    if (res.status === 404) { alert("Username not found!"); return; }
    if (res.status === 403) { alert("Request too fast, GitHub limited access. Please try again in a few minutes!"); return; }
    
    let data = await res.json();
    if (data.length === 0) break;
    following = following.concat(data);
    console.log(`Read following list: ${following.length} users...`);
    page++;
  }

  // 3. Get Followers List
  let followers = [];
  page = 1;
  while (true) {
    let res = await fetch(`https://api.github.com/users/${username}/followers?per_page=100&page=${page}`);
    let data = await res.json();
    if (data.length === 0) break;
    followers = followers.concat(data);
    console.log(`Read followers list: ${followers.length} users...`);
    page++;
  }

  // 4. Compare Data
  let followerLogins = new Set(followers.map(u => u.login));
  let nonMutuals = following.filter(u => !followerLogins.has(u.login));

  // 5. Output Results
  console.clear();
  console.log(` Analysis Complete!`);
  console.log(`You follow: ${following.length} users`);
  console.log(`Users following you: ${followers.length} users`);
  console.log(` There are ${nonMutuals.length} users who do not follow you back:`);
  
  // Display as table with links
  console.table(nonMutuals.map(u => ({
      'Username': u.login, 
      'Profile Link (Double click to open)': u.html_url
  })));
  
  alert(`Scan complete! Found ${nonMutuals.length} users who don't follow you back. Please check the console table.`);
}

// Run function
findNonMutuals();
// === End Copying ===