import { UserGuideItem } from '@app/classes/interfaces/user-guide';

const NEW_LINE = '<br><br>';

// tslint:disable:max-file-line-count
export const DRAWING_GUIDE_DATA: UserGuideItem[] = [
    {
        number: '01',
        title: 'Annuler-refaire',
        sections: [
            {
                fileTitle: 'Démonstration du annuler-refaire',
                fileName: 'annulerRefaire.gif',
                description: `Il est possible d'annuler ou refaire mes dernières actions.
                                        Une action signifie toute intervention menant à la modification de la surface de dessin, incluant le redimensionnement de la surface.
                                    ${NEW_LINE}Il est possible d'annuler une action avec le raccourci <span class="keyboard-key">Ctrl + Z</span>.
                                    ${NEW_LINE}Il est possible de refaire une action avec le raccourci <span class="keyboard-key">Ctrl + Shift + Z</span>.`,
            },
        ],
    },
    {
        title: 'Couleur',
        subtitle: [
            {
                number: '02',
                title: 'La palette',
                sections: [
                    {
                        fileTitle: 'Fonctionnalités de la palette',
                        fileName: 'color_palette.gif',
                        description: `La palette de couleur sert à appliquer des couleurs aux dessins. Elle est accessible par tous les outils dans l’application. Certains outils utilisent une seule couleur et d’autres en utilisent deux dépendamment de la forme de l’objet.
                                    ${NEW_LINE} À première vue, cet outil consiste d’une palette accompagnée de deux plages de valeurs. Donc, pour choisir une nouvelle couleur, on peut soit cliquer soit faire glisser la souris n’importe où sur la palette pour obtenir une variation de couleur. La première plage de valeur permet à déterminer rapidement une nouvelle couleur alors que la deuxième permet d’ajuster la transparence de la couleur présente.
                                    ${NEW_LINE} En dessous se trouvent 4 champs dans lesquels on peut manuellement préciser la couleur désirée. Les 3 premiers champs supportent des valeurs RGB contenant seulement deux caractères. Le dernier champ détermine la couleur en mode hexadécimale de longueur 6.
                                    ${NEW_LINE} Finalement, un bouton Appliquer permet de sauvegarder la couleur et celle-ci est rajoutée en haut parmi les 10 dernières couleurs récemment utilisées.`,
                    },
                ],
            },
            {
                number: '02',
                title: 'Application de la couleur',
                sections: [
                    {
                        fileTitle: "Démonstration de l'application de couleur",
                        fileName: 'application_of_color.gif',
                        description: `Afin de modifier une couleur, il suffit de cliquer soit sur Principale soit sur Secondaire. Cette action démasque la palette de couleur à partir de laquelle vous pourrez faire une nouvelle sélection. Le bouton Appliquer confirme votre choix.
                                     ${NEW_LINE} De plus, un clic gauche sur une des couleurs récentes sélectionne la couleur en question comme couleur principale. Un clic droit applique la couleur comme couleur secondaire. Un bouton au milieu des deux panneaux de couleurs permet d'inverser la couleur principale et secondaire.`,
                    },
                ],
            },
        ],
    },
    {
        title: 'Outils',
        subtitle: [
            {
                title: 'Aérosol',
                number: '03',
                sections: [
                    {
                        fileTitle: "Démonstration de l'aérosol",
                        fileName: 'aerosol.gif',
                        description: `L'outil Aérosol permet à l'utilisateur de tracer une série de points compris dans un cercle donné, à une quelconque intervalle. Le raccourci clavier vers l'outil Aérosol est la <span class="keyboard-key">touche A</span>.
                                    ${NEW_LINE}Le panneau d'attributs permet de paramétrer:
                                        <ul>
                                            <li>Le nombre de points par émission</li>
                                            <li>La fréquence des émissions (émissions/seconde)</li>
                                            <li>La taille d'un émission</li>
                                            <li>La taille des gouttelettes</li>
                                        </ul>`,
                    },
                ],
            },
            {
                title: 'Crayon',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Utilisation du crayon pour le dessin de TS Paint',
                        fileName: 'pencil.gif',
                        description: `Le crayon est l'outil de base de notre application. Dès que vous accédez à TS Paint, vous pouvez commencer à dessiner ce que vous désirez avec le crayon.
                                    ${NEW_LINE}Le panneau d'attributs à gauche vous permet de définir l'épaisseur de votre crayon. Cet outil est aussi accessible via la <span class="keyboard-key">touche C</span> sur le clavier.<br/>`,
                    },
                ],
            },
            {
                title: 'Efface',
                number: '03',
                sections: [
                    {
                        fileTitle: "Fonctionnalité de l'efface",
                        fileName: 'eraser.gif',
                        description: `L'efface permet de supprimer des parties de vos dessins. En d'autres mots, cet outil, disponible par l'intermédiaire de la <span class="keyboard-key">touche E</span>, transforme les pixels sélectionnés sur la surface de dessin en blanc.
                                  ${NEW_LINE}Cet outil est représenté par un carré blanc avec une bordure mince noire.<br/>Pour utiliser cet outil, il suffit de faire un clic gauche sur la surface de dessin et de faire glisser la souris aux endroits que vous souhaiter effacer.
                                  ${NEW_LINE}Le panneau d'attributs permet de modifier la taille de l'efface.`,
                    },
                ],
            },
            {
                title: 'Ellipse',
                number: '03',
                sections: [
                    {
                        fileTitle: "Démonstration de l'ellipse",
                        fileName: 'ellipse.gif',
                        description: `L'outil Ellipse permet à l'utilisateur de tracer une ellipse ou un cercle sur la zone de dessin par un glisser-déposer.
                                    ${NEW_LINE}Le raccourci clavier vers l'outil Ellipse est la <span class="keyboard-key">touche 2</span>.
                                    <br/>Il est possible de tracer un cercle en maintenant la <span class="keyboard-key">touche Shift</span>.
                                    ${NEW_LINE}Le panneau d'attributs permet de:
                                    <ul>
                                        <li>Activer/désactiver le remplissage</li>
                                        <li>Activer/désactiver le contour</li>
                                        <li>Définir l'épaisseur du contour</li>
                                    </ul>
                                    <br/>L'intérieur de la forme est dessiné avec la couleur principale alors que le contour est dessiné avec la couleur secondaire.`,
                    },
                ],
            },
            {
                title: 'Étampe',
                number: '03',
                sections: [
                    {
                        fileTitle: "Illustration de l'outil Étampe",
                        fileName: 'stamp.gif',
                        description: `L'outil Étampe permet à l'utilisateur de tracer une étampe parmis les choix disponibles dans le panneau d'attributs. Le raccourci clavier vers l'outil Étampe est la <span class="keyboard-key">touche D</span>.
                                    ${NEW_LINE}Le panneau d'attributs permet de:
                                    <ul>
                                        <li>La taille de l'étampe sélectionnée</li>
                                        <li>L'angle de l'étampe sélectionnée</li>
                                        <li>Le choix de l'étampe</li>
                                    </ul>
                                    <br/>Il y a deux variétés d'étampes disponibles: émojis et autres.
                                    ${NEW_LINE}Il est possible de régler l'angle de l'étampe directement dans la zone de dessin avec la roulette de la souris.
                                    Le maintien de la <span class="keyboard-key">touche ALT</span> permet de régler l'angle de façon plus précise.`,
                    },
                ],
            },
            {
                title: 'Grille',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Démonstration de la grille',
                        fileName: 'grille.gif',
                        description: `L'outil Grille permet d'afficher une grille sur la surface de dessin. Elle sert également d'alignement pour le magnétisme (voir la section sélection de ce guide).
                        ${NEW_LINE}Il est possible de faire affiche/disparaitre la grille à l'aide de la <span class="keyboard-key">touche G</span>.
                                  ${NEW_LINE}Le panneau d'attributs permet de paramétrer:
                                      <ul>
                                          <li>La grosseur des cases</li>
                                          <li>La transparence de la grille</li>
                                      </ul>
                        ${NEW_LINE}Le raccourci clavier pour augmenter la grosseur des cases de la grille est la <span class="keyboard-key">touche =</span> et celui pour la diminuer est la <span class="keyboard-key">touche -</span> .
                                      `,
                    },
                ],
            },
            {
                title: 'Ligne',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Exemple de ligne en appliquant les touches du clavier',
                        fileName: 'line_normal.gif',
                        description: `L'outil Ligne permet à l'utilisateur de tracer une ligne ou un plusieurs segments de ligne sur la zone de dessin par un clic. Pour terminer le traçage, il suffit de faire un double clic.
                              ${NEW_LINE}Le raccourci clavier vers l'outil Ligne est la <span class="keyboard-key">touche L</span>.
                              <br/>Il est possible de forcer l'alignement avec l'axe des X avec un angle multiple de 45 degrés en maintenant la <span class="keyboard-key">touche Shift</span>.
                              <br/>Il est possible d'annuler le dernier segment de ligne avec la <span class="keyboard-key">touche Backspace</span>.
                              <br/>Il est possible d'annuler l'ensemble des segments de ligne avec la <span class="keyboard-key">touche Escape</span>.
                              <br/>Il est possible de connecter un segment de ligne au segment initial lorsque la souris passe à proximité.${NEW_LINE}`,
                    },
                    {
                        fileTitle: 'Application des points de jonction avec la ligne',
                        fileName: 'line_junction.gif',
                        description: `Le panneau d'attributs permet de:
                              <ul>
                                  <li>Définir l'épaisseur de la ligne</li>
                                  <li>Activer/Désactiver les points de jonction</li>
                                  <li>Définir l'épaisseur des points de jonction</li>
                              </ul>`,
                    },
                ],
            },
            {
                title: 'Plume',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Démonstration de la plume',
                        fileName: 'plume.gif',
                        description: `L’outil Plume permet à l’utilisateur de faire de la calligraphie. La pointe de cet outil est une ligne mince permettant de représenter cet art. La <span class="keyboard-key">touche P</span> permet d'accéder à la plume rapidement.
                                    ${NEW_LINE}L'angle de la Plume peut être modifié afin d'offrir plus de flexibilité à l'utilisateur. La roulette de la souris permet d'augmenter ou de diminuer l'angle de 15 degrés. Si la <span class="keyboard-key">touche ALT</span> est appuyée
                                    pendant cette action, l'angle de la rotation est modifié de 1 degré. Par défaut, l'angle est à 0 degré et la taille de la plume est de 20 pixels.
                                    ${NEW_LINE}Il est possible de modifier:<br/>
                                    <ul>
                                        <li>La taille</li>
                                        <li>L'angle</li>
                                        <li>La couleur</li>
                                    </ul>`,
                    },
                ],
            },
            {
                title: 'Pinceau',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Illustrations des différents pinceaux',
                        fileName: 'brush.gif',
                        description: `L’outil Pinceau permet à l’utilisateur de tracer sur la zone de dessin des traits personnalisés. La <span class="keyboard-key">touche W</span> permet d'accéder au pinceau rapidement.
                                    ${NEW_LINE}Il est possible de modifier:<br/>
                                    <ul>
                                        <li>L’épaisseur</li>
                                        <li>La texture</li>
                                        <li>La couleur</li>
                                    </ul>
                                    <br/>Les textures disponibles sont:<br/>
                                    <ul>
                                        <li>Ombre</li>
                                        <li>Flou</li>
                                        <li>Ombre Noire</li>
                                        <li>Linéaire</li>
                                        <li>Point</li>
                                        <li>Fractal</li>
                                    </ul>`,
                    },
                ],
            },
            {
                title: 'Pipette',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Fonctionnalité de la pipette',
                        fileName: 'pipette.gif',
                        description: `La pipette permet de choisir une couleur à partir de la zone de dessin.
                                    Il est possible d'assigner la couleur saisie à la couleur principale par un <span class="keyboard-key">clic gauche</span>
                                    ou à la couleur secondaire par un <span class="keyboard-key">clic droit</span>.
                                  ${NEW_LINE}Le reccourci clavier vers l'outil pipette est la <span class="keyboard-key">touche I</span>
                                  ${NEW_LINE}Le panneau d'attributs contient un cercle de prévisualisation permettant d'avoir une meilleure vue des pixels du canvas`,
                    },
                ],
            },
            {
                title: 'Polygone',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Démonstration du polygone avec contour et remplissage',
                        fileName: 'polygone.gif',
                        description: `L'outil Polygone permet à l'utilisateur de tracer un polygone régulier et convexe sur la zone de dessin par un glisser-déposer.
                                  ${NEW_LINE}Le raccourci clavier vers l'outil Polygone est la <span class="keyboard-key">touche 3</span>.
                                  ${NEW_LINE}Le panneau d'attributs permet de:
                                  <ul>
                                      <li>Activer/désactiver le remplissage</li>
                                      <li>Activer/désactiver le contour</li>
                                      <li>Définir l'épaisseur du contour</li>
                                      <li>Sélectionner le nombre de côté (3 à 12)</li>
                                  </ul>
                                   <br/>L'intérieur de la forme est dessiné avec la couleur principale alors que le contour est dessiné avec la couleur secondaire.`,
                    },
                ],
            },
            {
                title: 'Rectangle',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Démonstration du rectangle avec contour et remplissage',
                        fileName: 'rectangle.gif',
                        description: `L'outil Rectangle permet à l'utilisateur de tracer un rectangle ou un carré sur la zone de dessin par un glisser-déposer.
                                    ${NEW_LINE}Le raccourci clavier vers l'outil Rectangle est la <span class="keyboard-key">touche 1</span>.
                                    <br/>Il est possible de tracer un carré en maintenant la <span class="keyboard-key">touche Shift</span>.
                                    ${NEW_LINE}Le panneau d'attributs permet de:
                                    <ul>
                                        <li>Activer/désactiver le remplissage</li>
                                        <li>Activer/désactiver le contour</li>
                                        <li>Définir l'épaisseur du contour</li>
                                    </ul>
                                     <br/>L'intérieur de la forme est dessiné avec la couleur principale alors que le contour est dessiné avec la couleur secondaire.`,
                    },
                ],
            },
            {
                title: 'Sceau de peinture',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Démonstration du Sceau de peinture',
                        fileName: 'sceaudepeiture.gif',
                        description: `L'outil Sceau de peinture permet d’effectuer un remplissage qui colore une ou plusieurs étendues de pixels en
                        fonction de leur couleur.
                                  ${NEW_LINE}Le raccourci clavier vers l'outil Sceau de peinture est la <span class="keyboard-key">touche B</span>.
                                  <br/>Le remplissage s'effectue avec la couleur active.
                                  ${NEW_LINE}Il est possible de sélectionner une valeur de tolérance dans le panneau des attributs. Un valeur de zéro indique que seuls les pixels
                                  de couleur identique seront colorés. Plus la valeur monte, plus l’écart de couleur toléré est grand. Une valeur de 100 indique que toutes les couleurs
                                  sont acceptées et donc que l’entièreté des pixels de la surface de dessin sera coloré.
                                  ${NEW_LINE}Deux modes d'opération sont disponibles:
                                  <ul>
                                      <li>Le mode Pixels Contigus effectue un remplissage des pixels voisins de l'endroit où le clic a été effectué dont la couleur correspond.
                                      Pour utiliser ce mode, il faut effectuer un <span class="keyboard-key">clic gauche</span>.</li>
                                      <li>Le mode Pixels Non-contigus effectue un remplissage de tous les pixels du dessin dont la couleur correspond.
                                      Pour utiliser ce mode, il faut effectuer un <span class="keyboard-key">clic droit</span>.</li>
                                  </ul>`,
                    },
                ],
            },
            {
                title: 'Texte',
                number: '03',
                sections: [
                    {
                        fileTitle: 'Démonstration du Texte',
                        fileName: 'text.gif',
                        description: `L'outil texte permet d'écrire du texte. Pour débuter la création d'un texte, il suffit d'effectuer un clic gauche de la souris au point de départ du texte.
                                  Pour terminer le texte, il suffit d'effectuer un 2e clic de souris ou de sélectionner un autre outil.
                                  ${NEW_LINE}Le raccourci clavier vers l'outil Texte est la <span class="keyboard-key">touche G</span>.
                                  <br/>Il est possible de se déplacer dans le texte avec les touches<span class="keyboard-key"> directionnelles</span>.
                                  <br/>Il est possible de supprimer un caractère dans le texte avec les touches<span class="keyboard-key"> Backspace</span> et <span class="keyboard-key"> Delete</span>..
                                  <br/>Il est possible d'annuler un texte avec la touche <span class="keyboard-key"> Escape</span>.
                                  <br/>Il est possible d'effectuer un saut de ligne avec la touche <span class="keyboard-key"> Enter</span>.
                                  ${NEW_LINE}Il est possible de configurer plusieurs paramètres pour l'entièreté du texte dans le panneau des attributs:
                                  <ul>
                                      <li>La police</li>
                                      <li>Les mutateurs (gras et/ou italique)</li>
                                      <li>L'alignement (gauche, centre ou droite)</li>
                                      <li>La couleur</li>
                                  </ul>`,
                    },
                ],
            },
        ],
    },
    {
        title: 'Sélection',
        subtitle: [
            {
                number: '04',
                title: 'Magnétisme',
                sections: [
                    {
                        fileTitle: 'Démonstration du magnétisme',
                        fileName: 'magnetisme.gif',
                        description: `Il est possible d'activer l'option magnétisme dans le panneau d'attributs des différentes sélections ou à l'aide de la<span class="keyboard-key"> touche M</span>.
                    <br>Une fois tout déplacement de la sélection, par souris ou à l'aide des touches directionnelles sera automatiquement aligné avec la grille. À noter que le magnétisme s'applique uniquement sur la sélection.
                `,
                    },
                ],
            },
            {
                number: '04',
                title: 'Manipulation de la sélection',
                sections: [
                    {
                        fileTitle: 'Démonstration des manipulations possibles de la sélection',
                        fileName: 'manipulation_selection.gif',
                        description: `Il est possible d'effectuer plusieurs manipulations de la sélection active tel que:
                    ${NEW_LINE}Copier la sélection dans le presse-papier. Le raccourci est <span class="keyboard-key"> Ctrl+C</span>
                    ${NEW_LINE}Couper la sélection, soit la supprimer du dessin et la copier dans le presse-papier. Le raccourci est <span class="keyboard-key"> Ctrl+X</span>
                    ${NEW_LINE}Coller la sélection contenu dans le presse-papier dans le canvas. Le raccourci est <span class="keyboard-key"> Ctrl+V</span>
                    ${NEW_LINE}Supprimer la sélection. Le raccourci est <span class="keyboard-key"> Delete</span>
                    `,
                    },
                ],
            },
            {
                number: '04',
                title: 'Redimmension de sélection',
                sections: [
                    {
                        fileTitle: 'Démonstration de la redimension de la sélection',
                        fileName: 'redimension.gif',
                        description: `Il est possible de redimensionner une sélection à l'aide des huits points de contrôle.
                                    Le point de contrôle opposé est fixe pendant le redimensionnement.
                                    <br> Il est possible de produire un effet miroir en déplaçant le point de contrôle de l'autre côté de son opposé.sélection
                                    ${NEW_LINE}Il est possible de conserver les proportions de la sélection en maintenant la touche <span class="keyboard-key"> Shift</span>.
                                    `,
                    },
                ],
            },
            {
                number: '04',
                title: 'Rotation de sélection',
                sections: [
                    {
                        fileTitle: 'Démonstration de la rotation de la sélection',
                        fileName: 'rotation.gif',
                        description: `Il est possible de faire une rotation d'une sélection autour de son centre avec la roulette de la souris.
                                    À chaque cran de roulette, une rotation de 15 degrés est effectuée.
                                    ${NEW_LINE}Il est possible d'effectue une rotation par cran de 1 degré en enfonçant la touche <span class="keyboard-key"> Alt</span>.
                                    `,
                    },
                ],
            },
            {
                number: '04',
                title: 'Sélection par Ellipse',
                sections: [
                    {
                        fileTitle: 'Démonstration de la sélection par ellipse',
                        fileName: 'selectionEllipse.gif',
                        description: `Il est possible de faire une sélection par un glisser-déposer.
                                    Ainsi l'ellipse de sélection est officiellement créée.
                                    Tous les pixels à l'intérieur de l'ellipse sont sélectionnés et peuvent être manipulés.
                                    Il est possible de déplacer la sélection avec la souris ou avec les flèches du clavier.
                                    ${NEW_LINE}Le raccourci clavier vers l'outil Sélection par Ellipse est la <span class="keyboard-key">touche R</span>.
                                    ${NEW_LINE}Il est possible d'effectuer une sélection dans un cercle en maintenant la <span class="keyboard-key">touche Shift</span>.
                                    ${NEW_LINE}L'utilisation de la <span class="keyboard-key">touche Escape</span> annule la sélection en entier.
                                    ${NEW_LINE}Il est possible de sélectionner toute la surface de dessin avec le raccourci <span class="keyboard-key">Ctrl + A</span> ou via un bouton dans le panneau des attributs.`,
                    },
                ],
            },
            {
                number: '04',
                title: 'Sélection par Rectangle',
                sections: [
                    {
                        fileTitle: 'Démonstration de la sélection par rectangle',
                        fileName: 'selectionRectangle.gif',
                        description: `Il est possible de faire une sélection par un glisser-déposer.
                        Ainsi le rectangle de sélection est officiellement créé.
                        Tous les pixels à l'intérieur du rectangle sont sélectionnés et peuvent être manipulés.
                        Il est possible de déplacer la sélection avec la souris ou avec les flèches du clavier.
                        ${NEW_LINE}Le raccourci clavier vers l'outil Sélection par Rectangle est la <span class="keyboard-key">touche R</span>.
                        ${NEW_LINE}Il est possible d'effectuer une sélection dans un carré en maintenant la <span class="keyboard-key">touche Shift</span>.
                        ${NEW_LINE}L'utilisation de la <span class="keyboard-key">touche Escape</span> annule la sélection en entier.
                        ${NEW_LINE}Il est possible de sélectionner toute la surface de dessin avec le raccourci <span class="keyboard-key">Ctrl + A</span> ou via un bouton dans le panneau des attributs.`,
                    },
                ],
            },
            {
                title: 'Sélection par baguette magique',
                number: '04',
                sections: [
                    {
                        fileTitle: 'Démonstration de la sélection par baguette magique',
                        fileName: 'baguette.gif',
                        description: `Il est possible de faire une sélection basé sur la couleur à partir d'une baguette magique.
                       ${NEW_LINE}Le raccourci clavier vers l'outil Sélection par Baguette magique est la <span class="keyboard-key">touche V</span>.

                                  ${NEW_LINE}Deux modes d'opération sont disponibles:
                                  <ul>
                                      <li>Le mode Pixels Contigus effectue une sélection des pixels voisins de l'endroit où le clic a été effectué dont la couleur correspond.
                                      Pour utiliser ce mode, il faut effectuer un <span class="keyboard-key">clic gauche</span>.</li>
                                      <li>Le mode Pixels Non-contigus effectue une sélection de tous les pixels du dessin dont la couleur correspond.
                                      Pour utiliser ce mode, il faut effectuer un <span class="keyboard-key">clic droit</span>.</li>
                                  </ul>`,
                    },
                ],
            },
        ],
    },
];
