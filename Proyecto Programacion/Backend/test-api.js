// Test the actual API endpoints without authentication
const fetch = require('node-fetch');

async function testAPIWithoutAuth() {
    const baseUrl = 'http://localhost:3000/api';
    
    try {
        console.log('=== Testing API Endpoints ===');
        
        // Test 1: Get current permissions (this should work without auth for testing)
        console.log('\n1. Getting current permissions for board 1...');
        try {
            const response = await fetch(`${baseUrl}/boards/1/permissions`);
            if (response.ok) {
                const permissions = await response.json();
                console.log('Current permissions:', permissions.map(p => ({ 
                    userId: p.userId, 
                    username: p.user.username, 
                    level: p.level 
                })));
            } else {
                console.log('Get permissions failed:', response.status, await response.text());
            }
        } catch (error) {
            console.log('Get permissions error:', error.message);
        }
        
        // Test 2: Try to delete permission without auth (will likely fail, but we'll see the logs)
        console.log('\n2. Attempting to delete permission (will likely fail due to auth)...');
        try {
            const deleteResponse = await fetch(`${baseUrl}/boards/1/permissions/2`, {
                method: 'DELETE'
            });
            console.log('Delete response status:', deleteResponse.status);
            console.log('Delete response:', await deleteResponse.text());
        } catch (error) {
            console.log('Delete error:', error.message);
        }
        
    } catch (error) {
        console.error('General error:', error);
    }
}

testAPIWithoutAuth();
