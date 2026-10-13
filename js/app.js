/*
  ALBA Hábitat. Comportamiento de la demo.
  Los modelos se editan en js/datos.js; los textos de las secciones, en index.html.
*/
(function () {
  'use strict';

  var raiz = document.documentElement;
  var datos = window.ALBA || { modelos: [], rangosSuperficie: [] };
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function crear(etiqueta, atributos, hijos) {
    var el = document.createElement(etiqueta);
    Object.keys(atributos || {}).forEach(function (clave) {
      if (clave === 'texto') el.textContent = atributos[clave];
      else if (clave === 'clase') el.className = atributos[clave];
      else el.setAttribute(clave, atributos[clave]);
    });
    (hijos || []).forEach(function (hijo) { el.appendChild(hijo); });
    return el;
  }

  function textoDormitorios(n) { return n + (n === 1 ? ' dormitorio' : ' dormitorios'); }

  /* ---------- Revelados al desplazar ---------- */
  var observador = null;

  function observar(elementos) {
    if (!observador) return;
    elementos.forEach(function (el) { observador.observe(el); });
  }

  function iniciarRevelados() {
    if (!('IntersectionObserver' in window)) return;
    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('es-visible');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    // La clase .anim activa los estados ocultos del CSS solo cuando hay observador.
    raiz.classList.add('anim');
    observar($$('[data-reveal]'));
  }

  /* ---------- Cabecera y menú móvil ---------- */
  function iniciarCabecera() {
    var cabecera = $('#cabecera');
    var boton = $('.menu-boton');
    var menu = $('#menu');
    var texto = $('.menu-boton-texto');
    var movil = window.matchMedia('(max-width: 899px)');

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        cabecera.classList.toggle('es-desplazada', !entradas[0].isIntersecting);
      }, { rootMargin: '-80px 0px 0px 0px' }).observe($('.portada-texto'));
    }

    function fijarMenu(abierto) {
      raiz.classList.toggle('menu-abierto', abierto);
      boton.setAttribute('aria-expanded', String(abierto));
      texto.textContent = abierto ? 'Cerrar' : 'Menú';
      // Con el menú cerrado en móvil, sus enlaces no deben recibir foco.
      menu.inert = movil.matches && !abierto;
    }

    boton.addEventListener('click', function () {
      fijarMenu(!raiz.classList.contains('menu-abierto'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) fijarMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && raiz.classList.contains('menu-abierto')) {
        fijarMenu(false);
        boton.focus();
      }
    });
    movil.addEventListener('change', function () { fijarMenu(false); });
    fijarMenu(false);
  }

  /* ---------- Catálogo y filtros ---------- */
  var filtro = { dormitorios: 'todos', superficie: 'todas' };
  var lista, vacio, cuenta, botonReset;
  var primeraVez = true;

  function crearChip(grupo, valor, etiqueta, marcado) {
    var entrada = crear('input', { type: 'radio', name: grupo, value: valor });
    entrada.checked = marcado;
    return crear('label', { clase: 'chip' }, [entrada, crear('span', { texto: etiqueta })]);
  }

  function crearTarjeta(modelo, indice) {
    var img = crear('img', {
      src: 'img/' + modelo.imagen + '-1500.webp',
      srcset: 'img/' + modelo.imagen + '-800.webp 800w, img/' + modelo.imagen + '-1500.webp 1500w',
      sizes: '(min-width: 1024px) 55vw, (min-width: 640px) 48vw, 100vw',
      width: '1500', height: '1000', loading: 'lazy', decoding: 'async', alt: modelo.alt
    });
    var foto = crear('div', { clase: 'foto' }, [img]);
    var titulo = crear('h3', { texto: modelo.nombre });
    var datosModelo = crear('p', { clase: 'modelo-datos', texto: modelo.superficie + ' m² · ' + textoDormitorios(modelo.dormitorios) });
    var boton = crear('button', { clase: 'btn btn-secundario btn-chico', type: 'button', 'data-modelo': modelo.id }, [
      document.createTextNode('Ver modelo'),
      crear('span', { clase: 'solo-lectores', texto: ' ' + modelo.nombre }),
      crear('i', { 'aria-hidden': 'true', texto: '→' })
    ]);
    var li = crear('li', { clase: 'modelo' }, [
      foto,
      crear('div', { clase: 'modelo-cabeza' }, [titulo, datosModelo]),
      crear('p', { clase: 'modelo-resumen', texto: modelo.resumen }),
      boton
    ]);
    li.style.setProperty('--i', indice);
    return li;
  }

  function modelosFiltrados() {
    var rango = datos.rangosSuperficie.filter(function (r) { return r.id === filtro.superficie; })[0];
    return datos.modelos.filter(function (m) {
      var okDorm = filtro.dormitorios === 'todos' || m.dormitorios === Number(filtro.dormitorios);
      var okSup = !rango || (m.superficie >= rango.min && m.superficie <= rango.max);
      return okDorm && okSup;
    });
  }

  function pintarModelos() {
    var resultado = modelosFiltrados();
    var hayFiltro = filtro.dormitorios !== 'todos' || filtro.superficie !== 'todas';

    lista.textContent = '';
    resultado.forEach(function (modelo, i) {
      var tarjeta = crearTarjeta(modelo, i);
      if (primeraVez) {
        tarjeta.setAttribute('data-reveal', '');
        tarjeta.querySelector('.foto').setAttribute('data-reveal', 'foto');
      } else {
        tarjeta.classList.add('modelo-entra');
      }
      lista.appendChild(tarjeta);
    });
    if (primeraVez) observar($$('[data-reveal]', lista));

    lista.hidden = resultado.length === 0;
    vacio.hidden = resultado.length !== 0;
    botonReset.hidden = !hayFiltro;
    cuenta.textContent = resultado.length === 1 ? '1 modelo' : resultado.length + ' modelos';
    primeraVez = false;
  }

  function actualizarModelos() {
    // Fundido corto de salida antes de reordenar; si no hay animación, se cambia al instante.
    if (sinMovimiento.matches || !lista.animate || lista.hidden) { pintarModelos(); return; }
    lista.classList.add('es-saliente');
    window.setTimeout(function () {
      pintarModelos();
      lista.classList.remove('es-saliente');
    }, 120);
  }

  function restablecerFiltros() {
    filtro.dormitorios = 'todos';
    filtro.superficie = 'todas';
    $$('#filtros input').forEach(function (entrada) {
      entrada.checked = entrada.value === 'todos' || entrada.value === 'todas';
    });
    actualizarModelos();
  }

  function iniciarCatalogo() {
    lista = $('#lista-modelos');
    vacio = $('#modelos-vacio');
    cuenta = $('#filtros-cuenta');
    botonReset = $('#filtros-reset');
    var formulario = $('#filtros');
    var grupoDorm = $('#filtro-dormitorios');
    var grupoSup = $('#filtro-superficie');

    var dormitorios = datos.modelos
      .map(function (m) { return m.dormitorios; })
      .filter(function (n, i, todos) { return todos.indexOf(n) === i; })
      .sort(function (a, b) { return a - b; });

    grupoDorm.appendChild(crearChip('dormitorios', 'todos', 'Todos', true));
    dormitorios.forEach(function (n) { grupoDorm.appendChild(crearChip('dormitorios', String(n), String(n), false)); });

    grupoSup.appendChild(crearChip('superficie', 'todas', 'Todas', true));
    datos.rangosSuperficie.forEach(function (r) { grupoSup.appendChild(crearChip('superficie', r.id, r.etiqueta, false)); });

    formulario.addEventListener('change', function (e) {
      if (e.target.name !== 'dormitorios' && e.target.name !== 'superficie') return;
      filtro[e.target.name] = e.target.value;
      actualizarModelos();
    });
    formulario.addEventListener('reset', function (e) { e.preventDefault(); restablecerFiltros(); });
    formulario.addEventListener('submit', function (e) { e.preventDefault(); });
    $('#vacio-reset').addEventListener('click', function () {
      restablecerFiltros();
      $('#filtro-dormitorios input').focus();
    });

    pintarModelos();
  }

  /* ---------- Ficha de modelo ---------- */
  function iniciarFicha() {
    var ficha = $('#ficha');
    var actual = null;
    var origen = null;
    if (!ficha || typeof ficha.showModal !== 'function') return;

    function abrir(id, disparador) {
      var modelo = datos.modelos.filter(function (m) { return m.id === id; })[0];
      if (!modelo) return;
      actual = modelo;
      origen = disparador;

      var img = $('#ficha-img');
      img.src = 'img/' + modelo.imagen + '-1500.webp';
      img.alt = modelo.alt;
      $('#ficha-tipo').textContent = modelo.tipoImagen;
      $('#ficha-titulo').textContent = modelo.nombre;
      $('#ficha-superficie').textContent = modelo.superficie + ' m²';
      $('#ficha-dormitorios').textContent = String(modelo.dormitorios);
      $('#ficha-descripcion').textContent = modelo.descripcion;

      var ul = $('#ficha-lista');
      ul.textContent = '';
      modelo.caracteristicas.forEach(function (texto) { ul.appendChild(crear('li', { texto: texto })); });

      $('.ficha-info').scrollTop = 0;
      ficha.showModal();
    }

    $('#lista-modelos').addEventListener('click', function (e) {
      var boton = e.target.closest('[data-modelo]');
      if (boton) abrir(boton.getAttribute('data-modelo'), boton);
    });

    $('#ficha-cerrar').addEventListener('click', function () { ficha.close(); });
    // Clic en el fondo oscuro (fuera de la caja) cierra la ficha.
    ficha.addEventListener('click', function (e) { if (e.target === ficha) ficha.close(); });
    ficha.addEventListener('close', function () {
      if (origen && document.contains(origen)) origen.focus({ preventScroll: true });
      origen = null;
    });

    $('#ficha-asesoria').addEventListener('click', function () {
      var modelo = actual;
      origen = null; // El foco pasa al formulario, no vuelve a la tarjeta.
      ficha.close();
      elegirModelo(modelo ? modelo.id : '');
    });
  }

  /* ---------- Formulario (simulación) ---------- */
  var reglas = {
    nombre: function (v) { return v.trim().length >= 2 ? '' : 'Escribe tu nombre.'; },
    correo: function (v) {
      if (!v.trim()) return 'Escribe tu correo electrónico.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Revisa el formato del correo, por ejemplo nombre@dominio.com.';
    },
    modelo: function (v) { return v ? '' : 'Elige un modelo o indica que todavía no lo sabes.'; },
    terreno: function (v) { return v ? '' : 'Indica si ya tienes terreno.'; },
    mensaje: function (v) { return v.trim().length >= 10 ? '' : 'Cuéntanos un poco más: al menos 10 caracteres.'; }
  };

  function elegirModelo(id) {
    var select = $('#f-modelo');
    var seccion = $('#contacto');
    var simulacion = $('#simulacion');
    if (simulacion && !simulacion.hidden) mostrarFormulario();
    if (id) {
      select.value = id;
      validarCampo('modelo');
      select.classList.remove('es-elegido');
      void select.offsetWidth;
      select.classList.add('es-elegido');
    }
    seccion.scrollIntoView({ behavior: sinMovimiento.matches ? 'auto' : 'smooth', block: 'start' });
    $('#f-nombre').focus({ preventScroll: true });
  }

  function valorCampo(nombre) {
    var form = $('#formulario');
    if (nombre === 'terreno') {
      var marcado = $('input[name="terreno"]:checked', form);
      return marcado ? marcado.value : '';
    }
    return form.elements[nombre].value;
  }

  function controlCampo(nombre) {
    return nombre === 'terreno' ? $('#f-terreno') : $('#f-' + nombre);
  }

  function validarCampo(nombre) {
    var mensaje = reglas[nombre](valorCampo(nombre));
    var control = controlCampo(nombre);
    var aviso = $('#e-' + nombre);
    if (mensaje) {
      control.setAttribute('aria-invalid', 'true');
      aviso.textContent = mensaje;
      aviso.hidden = false;
    } else {
      control.removeAttribute('aria-invalid');
      aviso.hidden = true;
      aviso.textContent = '';
    }
    return !mensaje;
  }

  function mostrarFormulario() {
    $('#simulacion').hidden = true;
    $('#formulario').hidden = false;
  }

  function iniciarFormulario() {
    var form = $('#formulario');
    var simulacion = $('#simulacion');
    var select = $('#f-modelo');
    var tocados = {};

    datos.modelos.forEach(function (m) {
      select.appendChild(crear('option', { value: m.id, texto: m.nombre + ' · ' + m.superficie + ' m²' }));
    });

    Object.keys(reglas).forEach(function (nombre) {
      var control = controlCampo(nombre);
      control.addEventListener('focusout', function (e) {
        // En el grupo de opciones, no validar al pasar de una opción a otra.
        if (nombre === 'terreno' && control.contains(e.relatedTarget)) return;
        tocados[nombre] = true;
        validarCampo(nombre);
      });
      control.addEventListener('input', function () { if (tocados[nombre]) validarCampo(nombre); });
      control.addEventListener('change', function () { if (tocados[nombre] || nombre === 'terreno') validarCampo(nombre); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalidos = Object.keys(reglas).filter(function (nombre) {
        tocados[nombre] = true;
        return !validarCampo(nombre);
      });
      if (invalidos.length) {
        var primero = invalidos[0] === 'terreno' ? $('input[name="terreno"]', form) : controlCampo(invalidos[0]);
        primero.focus();
        return;
      }

      // Simulación: no se envía ni se guarda nada. Solo se muestra un resumen local.
      var modelo = datos.modelos.filter(function (m) { return m.id === valorCampo('modelo'); })[0];
      var filas = [
        ['Nombre', valorCampo('nombre').trim()],
        ['Correo electrónico', valorCampo('correo').trim()],
        ['Modelo de interés', modelo ? modelo.nombre : 'Todavía no lo sé'],
        ['¿Ya tienes terreno?', valorCampo('terreno')],
        ['Mensaje', valorCampo('mensaje').trim()]
      ];
      var resumen = $('#resumen');
      resumen.textContent = '';
      filas.forEach(function (fila) {
        resumen.appendChild(crear('div', {}, [crear('dt', { texto: fila[0] }), crear('dd', { texto: fila[1] })]));
      });

      form.hidden = true;
      simulacion.hidden = false;
      simulacion.focus({ preventScroll: true });
      $('#contacto').scrollIntoView({ behavior: sinMovimiento.matches ? 'auto' : 'smooth', block: 'start' });
    });

    $('#simulacion-volver').addEventListener('click', function () {
      mostrarFormulario();
      $('#f-nombre').focus();
    });
  }

  /* ---------- Recorrido: ambiente activo en el índice ---------- */
  function iniciarRecorrido() {
    var items = $$('[data-indice]');
    if (!items.length || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var id = entrada.target.getAttribute('data-ambiente');
        items.forEach(function (item) { item.classList.toggle('es-activo', item.getAttribute('data-indice') === id); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    $$('[data-ambiente]').forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Inicio ---------- */
  function seguro(fn) {
    try { fn(); } catch (error) { if (window.console) console.error(error); }
  }

  [iniciarRevelados, iniciarCabecera, iniciarCatalogo, iniciarFicha, iniciarFormulario, iniciarRecorrido].forEach(seguro);
})();
