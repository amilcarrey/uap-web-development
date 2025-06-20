// Debug utility for authentication issues
export const debugAuth = () => {
  console.log("🔍 AUTH DEBUG INFORMATION:");

  // Check localStorage token
  const token = localStorage.getItem("token");
  console.log(
    "📋 Token in localStorage:",
    token ? `${token.slice(0, 20)}...` : "NO TOKEN"
  );

  // Check token validity by parsing JWT (without verification)
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("🔑 Token payload:", payload);

      const now = Date.now() / 1000;
      const isExpired = payload.exp && payload.exp < now;
      console.log("⏰ Token expired:", isExpired);

      if (isExpired) {
        console.log("❌ Token is expired! User needs to login again.");
      }
    } catch (e) {
      console.log("❌ Invalid token format");
    }
  }

  // Check auth store
  const authStore = localStorage.getItem("auth-store");
  if (authStore) {
    try {
      const parsed = JSON.parse(authStore);
      console.log("🏪 Auth store:", {
        hasUser: !!parsed.state?.user,
        isAuthenticated: parsed.state?.isAuthenticated,
        username: parsed.state?.user?.username,
      });
    } catch (e) {
      console.log("❌ Could not parse auth store");
    }
  }

  // Test API call
  if (token) {
    console.log("🌐 Testing API call...");
    fetch("http://localhost:4322/api/permissions/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("📡 API Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("📡 API Response data:", data);
      })
      .catch((error) => {
        console.log("📡 API Error:", error);
      });
  }
};

// Debug utility for checking board ownership
export const debugBoards = () => {
  console.log("🏠 BOARD OWNERSHIP DEBUG:");

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("❌ No token found");
    return;
  }

  // Get all boards
  fetch("http://localhost:4322/api/boards", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("📋 All boards:", data);

      if (data.success && data.data?.items) {
        const boards = data.data.items;

        // Get current user from auth store
        const authStore = localStorage.getItem("auth-store");
        let currentUserId = null;
        if (authStore) {
          try {
            const parsed = JSON.parse(authStore);
            currentUserId = parsed.state?.user?.id;
          } catch (e) {
            console.log("❌ Could not parse auth store for user ID");
          }
        }

        console.log("👤 Current user ID:", currentUserId);

        boards.forEach((board: any) => {
          const isOwner = board.owner_id === currentUserId;
          console.log(
            `${isOwner ? "👑" : "👤"} Board: "${board.name}" (ID: ${
              board.id
            }) - ${isOwner ? "YOU ARE OWNER" : "NOT OWNER"}`
          );
        });

        const ownedBoards = boards.filter(
          (board: any) => board.owner_id === currentUserId
        );
        console.log(
          `✅ You can share ${ownedBoards.length} boards:`,
          ownedBoards.map((b: any) => b.name)
        );

        if (ownedBoards.length === 0) {
          console.log("💡 TIP: Create a new board to be able to share it!");
        }
      }
    })
    .catch((error) => {
      console.log("📡 API Error:", error);
    });
};

// Debug utility for permissions and query states
export const debugPermissions = (boardId?: string) => {
  console.log("🔍 PERMISSIONS DEBUG INFORMATION:");

  if (boardId) {
    console.log("📋 Board ID:", boardId);
  }

  // Check if we're in a component with access to QueryClient
  console.log("🔄 Query cache state (if available):");
  console.log(
    "To inspect query cache, run: queryClient.getQueryData(['board-permissions', boardId])"
  );
  console.log(
    "To inspect users cache, run: queryClient.getQueryData(['users'])"
  );

  // Check network requests in dev tools
  console.log("🌐 Check Network tab for API calls to:");
  console.log("- GET /api/permissions/users");
  console.log("- GET /api/permissions/boards/{boardId}/permissions");
  console.log("- POST /api/permissions/boards/{boardId}/share");

  // Check component state
  console.log("🎯 Component state debugging:");
  console.log("Check React DevTools for:");
  console.log("- ShareBoardDialog: selectedUsers, isUpdating");
  console.log("- PermissionsList: users, selectedUsers");
  console.log("- usePermissions hook state");
};

// Call this function in the browser console to debug
(window as any).debugAuth = debugAuth;
(window as any).debugBoards = debugBoards;
(window as any).debugPermissions = debugPermissions;
