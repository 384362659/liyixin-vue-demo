import axios from 'axios'
export default {
  searchDepts: async (deptno) => {
    let resp = []
    if (deptno) {
      resp = await axios.get(`/api/departments/actions/query?dname=${deptno}&page=0&size=0`)
    } else {
      resp = await axios.get(`/api/departments/actions/query?dname=`)
    }
    return resp.data
  },
  searchChildDepts: async (code) => {
    let resp = await axios.get(`/api/departments/query/${code}`)
    return resp.data
  },
  searchStaffs: async (code) => {
    let resp = await axios.get(`/api/departments/actions/queryUsers?dname=${code}`)
    return resp.data
  },
  create: async (dept) => {
    let resp = await axios.post(`/api/departments/`, dept)

    return resp
  },
  remove: async (deptno) => {
    let resp = await axios.delete(`/api/departments/${deptno}`)
    return resp.data
  },
  modify: async (dept) => {
    let resp = await axios.put(`/api/departments/`, {
      departmentCode: dept.departmentCode,
      dname: dept.dname
    })
    return resp
  }
}
