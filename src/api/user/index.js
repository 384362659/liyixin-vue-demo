/**
 * Created by binwang on 2018/11/7.
 */
import axios from 'axios'

export default {

  /**/
  data () {
    return {
      visible: false,
      tableData: [],
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10,
        userName: ''
      }
    }
  },
  /* 查找所有 */
  searchPerson: async (keywords) => {
    let resp = []
    if (!keywords) { // 查询整个部门
      resp = await axios.get(`/api/users/actions/query?name=`)
    } else {
      // 关键字查询  ele UI分页
      resp = await axios.get(`/api/users/actions/query?name=${keywords}&page=0&size=10`)
    }
    return resp.data
  },
  /* 查找某个部门 */
  queryEmps: async (deptno) => {
    let resp = await axios.get(`/api/users/${deptno}`)
    return resp.data
  },
  searchStaffs: async (code) => {
    let resp = await axios.get(`/api/departments/actions/queryUsers?dname=${code}`)
    return resp.data
  },
  /* 创建 */
  create: async (emp) => {
    let resp = await axios.post('/api/users', emp)
    return resp.data
  },
  /* 删除 */
  remove: async (code) => {
    let resp = await axios.delete(`/api/users/${code}`)

    return resp.data
  },
  /* 登陆 */
  login: async (emp) => {
    let resp = await axios.post(`/api/users/actions/login/`, emp)
    return resp
  },
  /* 修改 */
  updateEmp: async (emp) => {
    let resp = await axios.put('/api/users/', emp)
    return resp.data
  }
}
