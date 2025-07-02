// Test script to get auth token and test permission revocation
const fetch = require('node-fetch');

async function testPermissionRevocation() {
    const baseUrl = 'http://localhost:3000/api';
    
    try {
        // Login as Daniel (owner of board 1)
        console.log('1. Login as Daniel (owner)...');
        const loginResponse = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: 'Daniel2102', 
                password: 'password123' // Assuming this is the password
            })
        });
        
        if (!loginResponse.ok) {
            console.log('Login failed, trying with default password...');
            const loginResponse2 = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: 'Daniel2102', 
                    password: '123456' // Try another common password
                })
            });
            
            if (!loginResponse2.ok) {
                console.error('Login failed with both passwords');
                console.error('Response:', await loginResponse2.text());
                return;
            }
            const authData = await loginResponse2.json();
            console.log('Login successful with second password!');
        } else {
            const authData = await loginResponse.json();
            console.log('Login successful with first password!');
        }
        
        const authResponse = loginResponse.ok ? loginResponse : loginResponse2;
        const authData = await authResponse.json();
        const token = authData.token || authData.accessToken;
        
        if (!token) {
            console.error('No token received:', authData);
            return;
        }
        
        console.log('Token received:', token.substring(0, 20) + '...');
        
        // Get current permissions for board 1
        console.log('\n2. Getting current permissions for board 1...');
        const permissionsResponse = await fetch(`${baseUrl}/boards/1/permissions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const currentPermissions = await permissionsResponse.json();
        console.log('Current permissions:', currentPermissions.map(p => ({ 
            userId: p.userId, 
            username: p.user.username, 
            level: p.level 
        })));
        
        // Revoke Agustin's permission (userId: 2)
        console.log('\n3. Revoking Agustin\'s permission...');
        const revokeResponse = await fetch(`${baseUrl}/boards/1/permissions/2`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (revokeResponse.ok) {
            const revokeResult = await revokeResponse.json();
            console.log('Revoke successful:', revokeResult);
        } else {
            console.error('Revoke failed:', await revokeResponse.text());
            return;
        }
        
        // Get permissions again to verify
        console.log('\n4. Getting permissions after revocation...');
        const newPermissionsResponse = await fetch(`${baseUrl}/boards/1/permissions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const newPermissions = await newPermissionsResponse.json();
        console.log('Permissions after revocation:', newPermissions.map(p => ({ 
            userId: p.userId, 
            username: p.user.username, 
            level: p.level 
        })));
        
    } catch (error) {
        console.error('Error:', error);
    }
}

testPermissionRevocation();
