import basededatos from './basededatos.js';

const pelis = basededatos.peliculas;
const calif = basededatos.calificaciones;
const direc = basededatos.directores;
const crit = basededatos.criticos;
const gen = basededatos.generos;

/**
 * Devuelve el promedio de anios de estreno de todas las peliculas de la base de datos.
 */
export const promedioAnioEstreno = () => {
  return pelis.reduce((prev, curr) => (curr.anio += prev), 0) / pelis.length;
};

/**
 * Devuelve la lista de peliculas con promedio de critica mayor al numero que llega
 * por parametro.
 * @param {number} promedio
 */
export const pelicuasConCriticaPromedioMayorA = (promedio) => {
  /* Filtramos las seleccionadas segun el promedio */
  const seleccionadas = promedioCalificaciones().filter(
    (el) => el.promedio > promedio
  );

  /* Obtenemos el arreglo final de las peliculas */
  const seleccion = [];
  seleccionadas.forEach((el) => {
    seleccion.push(pelis.filter((fil) => fil.id === el.pelicula));
  });

  return seleccion;
};

/**
 * Devuelve la lista de peliculas de un director
 * @param {string} nombreDirector
 */
export const peliculasDeUnDirector = (nombreDirector) => {
  const idDirector = direc.filter((el) => el.nombre === nombreDirector)[0].id;
  return pelis.filter((el) => el.directores.includes(idDirector));
};

/**
 * Devuelve el promdedio de critica segun el id de la pelicula.
 * @param {number} peliculaId
 */
export const promedioDeCriticaBypeliculaId = (peliculaId) => {
  const pelicula = promedioCalificaciones().filter(
    (el) => el.pelicula === peliculaId
  );
  return pelicula[0].promedio;
};

/**
 * Obtiene la lista de peliculas con alguna critica con
 * puntuacion excelente (critica >= 9).
 * En caso de no existir el criticas que cumplan, devolver un array vacio [].
 * Ejemplo del formato del resultado: 
 *  [
        {
            id: 1,
            nombre: 'Back to the Future',
            anio: 1985,
            direccionSetFilmacion: {
                calle: 'Av. Siempre viva',
                numero: 2043,
                pais: 'Colombia',
            },
            directores: [1],
            generos: [1, 2, 6]
        },
        {
            id: 2,
            nombre: 'Matrix',
            anio: 1999,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Argentina'
            },
            directores: [2, 3],
            generos: [1, 2]
        },
    ],
 */
export const obtenerPeliculasConPuntuacionExcelente = () => {
  /* Filtramos las seleccionadas segun la puntuacion >= 9 */
  const seleccionadas = calif.filter((el) => el.puntuacion >= 9);

  /* Obtenemos el arreglo final de las peliculas */
  const seleccion = [];
  seleccionadas.forEach((el) => {
    seleccion.push(pelis.filter((fil) => fil.id === el.pelicula));
  });

  return seleccion;
};

/**
 * Devuelve informacion ampliada sobre una pelicula.
 * Si no existe la pelicula con dicho nombre, devolvemos undefined.
 * Ademas de devolver el objeto pelicula,
 * agregar la lista de criticas recibidas, junto con los datos del critico y su pais.
 * Tambien agrega informacion de los directores y generos a los que pertenece.
 * Ejemplo de formato del resultado para 'Indiana Jones y los cazadores del arca perdida':
 * {
            id: 3,
            nombre: 'Indiana Jones y los cazadores del arca perdida',
            anio: 2012,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Camboya'
            },
            directores: [
                { id: 5, nombre: 'Steven Spielberg' },
                { id: 6, nombre: 'George Lucas' },
            ],
            generos: [
                { id: 2, nombre: 'Accion' },
                { id: 6, nombre: 'Aventura' },
            ],
            criticas: [
                { critico: 
                    { 
                        id: 3, 
                        nombre: 'Suzana Mendez',
                        edad: 33,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 5 
                },
                { critico: 
                    { 
                        id: 2, 
                        nombre: 'Alina Robles',
                        edad: 21,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 7
                },
            ]
        },
 * @param {string} nombrePelicula
 */
export const expandirInformacionPelicula = (nombrePelicula) => {
  const seleccion = pelis.filter((el) => el.nombre === nombrePelicula)[0];
  if (!seleccion) return nombrePelicula + ' no existe en la base de datos';

  return {
    ...seleccion,
    directores: direc.filter((el) => seleccion.directores.includes(el.id)),
    generos: gen.filter((el) => seleccion.generos.includes(el.id)),
    criticas: getCriticas(seleccion),
  };
};

/* Funciones extras generadas para solucionar ciertos problemas */
const promedioCalificaciones = () => {
  /* Generamos un arreglo con las sumpatoria de las puntuaciones sin duplicar */
  const sinDuplicados = calif.reduce((acum, prev) => {
    if (acum.find((el) => el.pelicula === prev.pelicula)) {
      return acum.map((elemento) => {
        if (elemento.pelicula === prev.pelicula) {
          return {
            ...elemento,
            puntuacion: elemento.puntuacion + prev.puntuacion,
          };
        }

        return elemento;
      });
    }

    return [...acum, prev];
  }, []);

  /* Calculamos los promedios */
  let promedios = [];
  sinDuplicados.forEach((el) => {
    let countPeli = 0;
    calif.forEach((ele) => {
      if (el.pelicula === ele.pelicula) {
        countPeli++;
      }
    });
    promedios.push({
      pelicula: el.pelicula,
      promedio: el.puntuacion / countPeli,
    });
  });

  return promedios;
};

const getCriticas = ({ id }) => {
  const value = [];
  calif
    .filter((fil) => fil.pelicula === id)
    .forEach((el) => {
      value.push({
        critico: crit.filter((critico) => critico.id === el.critico)[0],
        puntuacion: el.puntuacion,
      });
    });
  return value;
};
