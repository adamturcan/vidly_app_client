import http from "./httpService";

const movieUrl = `/movies`;

function movieIdUrl(movieId) {
  return `${movieUrl}/${movieId}`;
}

export function getMovies() {
  return http.get(movieUrl);
}
export function deleteMovie(e) {
  const id = e.target.value;
  return http.delete(movieIdUrl(id));
}

export function getMovie(id) {
  try {
    return http.get(movieIdUrl(id));
  } catch (ex) {
    return "not found";
  }
}

export function saveMovie(id, data) {
  try {
    console.log(data);
    return http.put(movieIdUrl(id), data);
  } catch (ex) {
    return "not found";
  }
}
export function addMovie(data) {
  try {
    return http.post(movieUrl, { ...data });
  } catch (ex) {
    return "not found";
  }
}
