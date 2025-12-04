import { instance } from '../../shared/api/axiosInstance';

export const getOrders = async (name = null, status = null, pageNumber = 1, pageSize = 20) => {
  const params = {
    Page: pageNumber,      // Swagger
    PageSize: pageSize,    
  };

  if (name) params.Name = name;       // Swagger: "Name"
  if (status) params.Status = status; // Swagger: "Status"

  const queryString = new URLSearchParams(params).toString();

  try {
    // --- INTENTO 1: AXIOS ---
    const response = await instance.get(`api/orders?${queryString}`);

    if (response.status === 204) {
      return { data: { totalCount: 0, items: [] }, error: null };
    }

    return { data: response.data, error: null };

  } catch (axiosError) {
    
    try {
      const url = `api/orders?${queryString}`; 
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 204) {
        return { data: { totalCount: 0, items: [] }, error: null };
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || 'Error al cargar las órdenes');
      }

      return { data: data, error: null };

    } catch (fetchError) {
      console.error('Error al listar órdenes:', fetchError);
      return { data: [], error: fetchError };
    }
  }
};