import http from "./httpService";

const customerUrl = `/customers`;

function customeIdUrl(customerId) {
  return `${customerUrl}/${customerId}`;
}

export function getCustomers() {
  return http.get(customerUrl);
}
export function deleteCustomer(e) {
  const id = e.target.value;
  return http.delete(customeIdUrl(id));
}

export function getCustomer(id) {
  try {
    return http.get(customeIdUrl(id));
  } catch (ex) {
    return "not found";
  }
}

export function saveCustomer(id, data) {
  try {
    console.log(data);
    return http.put(customeIdUrl(id), data);
  } catch (ex) {
    return "not found";
  }
}
export function addCustomer(data) {
  try {
    return http.post(customerUrl, { ...data });
  } catch (ex) {
    return "not found";
  }
}
