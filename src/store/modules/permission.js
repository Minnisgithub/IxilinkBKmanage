import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(permissionKeys, route) {
  let temp = permissionKeys.filter(key => {
    return key.indexOf(route.name) != -1
  })
  return !!temp.length
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles 
 */
export function filterAsyncRoutes(routes, permissionKeys) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissionKeys, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissionKeys)
      }
      res.push(tmp)
    }
  })
  return res

}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, permissionKeys) {
    return new Promise(resolve => {
      let accessedRoutes = filterAsyncRoutes(asyncRoutes, permissionKeys) // 权限管理、
      if (accessedRoutes.length) {
        //这样做的目的是进去的时候  能够在合理的路径上
        accessedRoutes.unshift({
          path: '/',
          redirect: accessedRoutes[0].path,
          meta:{title:''},
          hidden: true
        })
      }
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true });
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
