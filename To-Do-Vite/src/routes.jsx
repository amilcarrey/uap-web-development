import {
    createRouter,
    RouterProvider,
    createRootRoute,
    createRoute,
    Outlet,
    Navigate,
  } from '@tanstack/react-router'
  import App from './App'
  import Settings from './Settings'
  import React from 'react'
  
  const rootRoute = createRootRoute({
    component: () => <Outlet />,
  })
  
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/home',
    component: App,
  })
  
  const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: Settings,
  })
  
  const redirectRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Navigate to="/home" />,
  })
  
  const routeTree = rootRoute.addChildren([
    homeRoute,
    settingsRoute,
    redirectRoute,
  ])
  
  const router = createRouter({ routeTree })
  
  export { router, RouterProvider }