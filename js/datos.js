/*
  Datos de la demo ALBA Hábitat.
  Este es el archivo que hay que editar para cambiar los modelos del catálogo.

  Cada modelo tiene:
    id            identificador corto, sin espacios ni tildes (se usa en el formulario).
    nombre        nombre visible.
    superficie    metros cuadrados (solo el número).
    dormitorios   cantidad de dormitorios (solo el número).
    resumen       frase corta de la tarjeta.
    descripcion   texto de la ficha.
    caracteristicas  lista de la ficha.
    imagen        nombre base del archivo en /img (existen dos tamaños: -800 y -1500).
    alt           descripción de la imagen para lectores de pantalla.
    tipoImagen    cómo se identifica la imagen: "Visualización conceptual" o "Fotografía de referencia".

  Todo es contenido de ejemplo: viviendas, superficies e imágenes son conceptuales.
*/
window.ALBA = {
  modelos: [
    {
      id: 'nido',
      nombre: 'Nido',
      superficie: 36,
      dormitorios: 1,
      resumen: 'Una vivienda compacta para escapadas.',
      descripcion: 'Estar, cocina y dormitorio en un solo volumen. El frente acristalado abre el interior al paisaje y la plataforma de madera suma un lugar para estar afuera.',
      caracteristicas: [
        'Estar y cocina en un mismo ambiente',
        'Frente acristalado de suelo a techo',
        'Plataforma exterior de madera',
        'Revestimiento de madera oscura'
      ],
      imagen: 'nido',
      alt: 'Cabaña compacta de madera oscura con frente acristalado sobre una plataforma de madera, en un campo abierto.',
      tipoImagen: 'Fotografía de referencia'
    },
    {
      id: 'brisa',
      nombre: 'Brisa',
      superficie: 58,
      dormitorios: 2,
      resumen: 'Espacios abiertos conectados con el exterior.',
      descripcion: 'La zona de día se prolonga en un porche cubierto. Las aberturas enfrentadas dejan pasar el aire y la luz de un lado a otro de la casa.',
      caracteristicas: [
        'Estar comedor con salida directa al porche',
        'Porche cubierto a nivel del jardín',
        'Dos dormitorios separados de la zona de día',
        'Fachada con revestimiento en tono madera'
      ],
      imagen: 'brisa',
      alt: 'Vivienda de una planta con fachada en tono madera y porche cubierto, rodeada de árboles y césped.',
      tipoImagen: 'Visualización conceptual'
    },
    {
      id: 'patio',
      nombre: 'Patio',
      superficie: 82,
      dormitorios: 2,
      resumen: 'Una propuesta alrededor de una terraza.',
      descripcion: 'La terraza con pérgola organiza la casa. Estar, comedor y dormitorios miran hacia ella, así que el exterior se usa como un ambiente más.',
      caracteristicas: [
        'Terraza con pérgola como centro de la vivienda',
        'Zona de día y zona de noche en volúmenes distintos',
        'Dos dormitorios con vista a la terraza',
        'Combinación de madera y paños claros'
      ],
      imagen: 'patio',
      alt: 'Vivienda de una planta formada por dos volúmenes, uno en tono madera y otro blanco, con una pérgola sobre la terraza.',
      tipoImagen: 'Visualización conceptual'
    },
    {
      id: 'horizonte',
      nombre: 'Horizonte',
      superficie: 108,
      dormitorios: 3,
      resumen: 'Ambientes compartidos para la vida familiar.',
      descripcion: 'Una planta alargada con cocina, comedor y estar en continuidad. Los tres dormitorios se agrupan en un extremo para separar el descanso de la actividad.',
      caracteristicas: [
        'Cocina, comedor y estar en un solo espacio',
        'Tres dormitorios agrupados en un ala',
        'Ventanales hacia el jardín',
        'Terraza lateral para comer afuera'
      ],
      imagen: 'horizonte',
      alt: 'Casa alargada de una planta en blanco y madera, con grandes ventanales hacia un jardín con árboles.',
      tipoImagen: 'Visualización conceptual'
    },
    {
      id: 'oliva',
      nombre: 'Oliva',
      superficie: 142,
      dormitorios: 3,
      resumen: 'Espacio adicional para trabajar desde casa.',
      descripcion: 'Suma a la vivienda familiar un estudio con acceso propio y luz natural. Queda cerca de la casa, pero apartado del movimiento del día.',
      caracteristicas: [
        'Estudio independiente con acceso propio',
        'Tres dormitorios',
        'Zona de día abierta a una terraza',
        'Volúmenes en blanco y madera'
      ],
      imagen: 'oliva',
      alt: 'Casa contemporánea de volúmenes blancos y de madera, con terraza delantera y árboles alrededor.',
      tipoImagen: 'Visualización conceptual'
    },
    {
      id: 'terra',
      nombre: 'Terra',
      superficie: 176,
      dormitorios: 4,
      resumen: 'Una distribución amplia para compartir.',
      descripcion: 'Dos alas unidas por una zona de día generosa. Hay lugar para recibir, para que cada quien tenga su cuarto y para moverse entre la casa y el jardín.',
      caracteristicas: [
        'Cuatro dormitorios repartidos en dos alas',
        'Zona de día amplia entre ambas',
        'Fachada de madera con aleros',
        'Jardín integrado al recorrido de entrada'
      ],
      imagen: 'terra',
      alt: 'Casa amplia con fachada de madera y aleros oscuros, rodeada de un jardín con senderos.',
      tipoImagen: 'Fotografía de referencia'
    }
  ],

  // Rangos del filtro de superficie. "min" y "max" en metros cuadrados.
  rangosSuperficie: [
    { id: 'hasta-60', etiqueta: 'Hasta 60 m²', min: 0, max: 60 },
    { id: '61-120', etiqueta: '61 a 120 m²', min: 61, max: 120 },
    { id: 'mas-120', etiqueta: 'Más de 120 m²', min: 121, max: Infinity }
  ]
};
