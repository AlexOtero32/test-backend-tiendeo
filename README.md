# Backend

Esta aplicación controla un sistema de drones que permite moverlos a través de una serie de instrucciones preestablecidas

## Funcionamiento

Para ejecutar el programa, se lanza el script a través de npm:

`npm run start`

o directamente a través de Node:

`node index.js`

El programa solicitará la ruta válida hacia el archivo de instrucciones (consultar sección correspondiente para establecer instrucciones).
Si no se introduce una ruta válida, el programa la seguirá solicitando hasta que se introduzca una.

Una vez hecho esto, el programa comprobará que las instrucciones se adaptan a las especificaciones. Si no es así, el programa mostrará un mensaje de error y finalizará.

A continuación, se procederá a mover los drones según el las instrucciones indicadas para cada uno.

Por último, los drones mostrarán como salida su posición y orientación finales, y acabarán volviendo a su punto de origen.

**Este programa ha sido probado en Ubuntu con Node v12.18.13 y npm v6.14.7**

## Cómo crear instrucciones

Las instruciones se deberán introducir en un archivo TXT, y tendrán el siguiente formato:

-   La primera línea indicará el área por la que se podrán mover los drones, con dos números enteros separados por un espacio `5 5`
-   La segunda línea marcará el punto de inicio y la orientación inicial del primer drone. Serán dos números enteros y una letra representando un punto cardinal, `N`, `S`, `E` u `O`, separados por espacios: `3 3 N`
-   La tercera línea será la serie de movimientos que el dron establecido en la línea anterior debe seguir, indicados con las letras `L`, `R` o `M` que indicarán _girar 90 grados a la izquierda_, _girar 90 a la derecha_ o _avanzar una posición hacia adelante_, respectivamente.
-   Los subsiguientes drones se indicarán en pares de líneas, de la misma forma que se indica en los dos puntos anteriores.

### Un ejemplo de instrucciones bien establecido:

```
5 5
3 3 E
L
3 3 E
MMRMMRMRRM
1 2 N
LMLMLMLMMLMLMLMLMM
3 3 E
LMLMLMLMMLMLMLMLMM
```

### Instrucciones mal establecidas:

1. El segundo drone no tiene ningún patrón de movimiento indicado.

```
5 5
3 3 E
L
3 3 E
```

2. El segundo drone tiene una instrucción no comprendida en las especificaciones

```
5 5
3 3 E
L
3 3 E
MMRMMRMRRMS
```

3. El segundo drone mira hacia un punto cardinal inexistente

```
5 5
3 3 E
L
3 3 Q
MMRMMRMRRM
```
