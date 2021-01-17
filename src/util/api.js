import axios from 'axios';
import objectToQuerystring from './objectToQuerystring';


const getProjectById = function(id) {
    return axios.get(`/api/projects/${id}`);
}

const getProjects = function(params) {
    const qs = objectToQuerystring(params);
    return axios.get(`/api/projects${qs}`);

}

export default {
    getProjects,
    getProjectById,
}