// EMERGENCY FIX: Run this in browser console to force database reseed
// Open browser console (F12) and paste this entire code

console.log('🚨 EMERGENCY CANDIDATE FIX - Starting...');

async function emergencyFixCandidates() {
  try {
    console.log('🔄 Step 1: Clearing old database...');
    
    // Clear IndexedDB
    const databases = await indexedDB.databases();
    for (const db of databases) {
      if (db.name === 'MyMockDatabase') {
        console.log('Deleting database:', db.name);
        const deleteRequest = indexedDB.deleteDatabase(db.name);
        await new Promise((resolve) => {
          deleteRequest.onsuccess = resolve;
          deleteRequest.onerror = resolve; // Continue even if error
          deleteRequest.onblocked = resolve; // Continue even if blocked
        });
      }
    }
    
    console.log('✅ Database cleared!');
    console.log('🔄 Step 2: Reloading page to trigger reseed...');
    
    // Reload page to trigger reseed
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ Emergency fix failed:', error);
    console.log('🔄 Trying page reload anyway...');
    window.location.reload();
  }
}

// Auto-run the fix
emergencyFixCandidates();