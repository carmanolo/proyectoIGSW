import axios from './root.service.js';

export async function createPlanService(planData) {
  try {
    const response = await api.post("/planes", planData);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function updatePlanService(id_plan, planData) {
  try {
    const response = await api.put(`/planes/${id_plan}`, planData);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function deletePlanService(id_plan) {
  try {
    const response = await api.delete(`/planes/${id_plan}`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function EditarPlanStatusService(id_plan, estado) {
  try {
    const response = await api.patch(`/planes/${id_plan}/estado`, { estado });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getPlanesService() {
  try {
    const response = await api.get("/planes");
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}
