import { login, logout, getInfo,getOdinToken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

//深度优先遍历，获取所有节点
function DFS(arr) {
  let nodes = [];
  let noop = (tArray) => {
    if (tArray && Array.isArray(tArray)) {
      tArray.forEach(ele => {
        nodes.push(ele);
        if ('child' in ele) {
          noop(ele.child)
        }
      })
    }
  }
  noop(arr);
  return nodes;
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PAGE_PERMISSION: (state, pgPermissionKeys) => {
    state.pgPermissionKeys = pgPermissionKeys;
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginId: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        getOdinToken().then(res=>{
          localStorage.setItem('SETODINTOKEN',res.data)
        })
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log(88888);
      getInfo({ token: state.token }).then(response => {
        const { data } = response
        if (!data) {
          return reject('用户信息获取失败，请稍后重试！')
        }
        const { list = [], userName,userId } = data
        let repeatedPermissionIds = [];
        list.forEach(v => {
          if (v.permissionIds && Array.isArray(v.permissionIds)) {
            repeatedPermissionIds = repeatedPermissionIds.concat(v.permissionIds)
          }
        })
        let flatRepeatedPermissionIds = DFS(repeatedPermissionIds)
        let res = []
        const fn = (source) => {
          source.forEach(el => {
            res.push(el)
            el.children && el.children.length > 0 ? fn(el.children) : ""
          })
        }
        fn(flatRepeatedPermissionIds)
        let descriptionList = res.map(item => {
          return item.description
        })
        const pgPermissionKeys = [...new Set(descriptionList)]
        commit('SET_PAGE_PERMISSION', pgPermissionKeys)
        commit('SET_NAME', userName)
        commit('SET_USERID', userId)
        localStorage.setItem('SETUSERID',userId)
        resolve({ pgPermissionKeys })

      })
    })
  },



  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

