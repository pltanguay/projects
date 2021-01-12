import { UserGuideItem } from '@app/classes/interfaces/user-guide';

const NEW_LINE = '<br><br>';

export const DIVERSE_GUIDE_DATA: UserGuideItem[] = [
    {
        title: 'Carrousel de dessins',
        number: '01',
        sections: [
            {
                fileTitle: 'Le carrousel de desseins',
                fileName: 'carrousel.gif',
                description: `Il est possible d'ouvrir un dessin déjà créé et sauvegardé sur le serveur de l'application.
                              Le carrousel présente les dessins enregistrés dans le serveur sous forme de liste que l'on peut faire défiler
                              à l'aide de la souris ou des touches du clavier.

                          ${NEW_LINE}Il suffit de cliquer sur une fiche pour charger le dessin.
                                      Il est également possible de supprimer un dessin via le carrousel.
                          ${NEW_LINE}Chaque fiche comporte un nom, des étiquettes et une prévisualisation du dessin. Il est possible d'effectuer une Filtrage par étiquettes des fiches.
                          ${NEW_LINE}Le raccourci clavier vers le Carrousel est <span class="keyboard-key">Ctrl + G</span>.`,
            },
        ],
    },
    {
        title: 'Continuer un dessin',
        number: '02',
        sections: [
            {
                fileTitle: "Continuation d'un dessin à partir du point d'entrée",
                fileName: 'continue_drawing.gif',
                description: `Le bouton Continuer un dessin sur la page d'entrée permet de récupérer et de continuer l'ancien dessin qui a été sauvegardé automatiquement la dernière fois.
                    ${NEW_LINE}Toutefois, si l'utilisateur n'a jamais dessiné auparavant ou s'il visite le site pour la première fois, ce bouton est désactivé.`,
            },
        ],
    },
    {
        title: 'Créer un dessin',
        number: '02',
        sections: [
            {
                fileTitle: "Créer un nouveau dessin à partir du point d'entrée",
                fileName: 'create_drawing_entry_point.png',
                description: `Parmi les 4 boutons sur la page d'accueil, le 1er consiste à créer un nouveau dessin. En cliquant dessus, vous serez alors dirigé vers une surface de dessin où vous pourriez commencer à dessiner.
                          ${NEW_LINE}Vous pouvez aussi exécuter cette action par l'intermédiaire du clavier, soit avec le raccourci <span class="keyboard-key">CTRL + O</span>.`,
            },
            {
                fileTitle: 'Créer un nouveau dessin à partir de la surface de dessin',
                fileName: 'create_drawing_entry_space.png',
                description: `D'ailleurs, cette option de créer un nouveau dessin est aussi accessible dans la surface de dessin.<br/>
              En cliquant sur l'icône <i class="fas fa-plus-square keyboard-key" aria-hidden="true"></i> en bas sur la barre latérale, une boîte de confirmation apparaît. L'option Non désigne que vous ne voulez pas effacer votre dessin, alors que l'option Oui signifie que vous voulez recommencer avec un dessin vide.`,
            },
        ],
    },
    {
        title: 'Envoyer le dessin par courriel',
        number: '03',
        sections: [
            {
                fileTitle: "Illustrations de l'envoi du dessin par courriel",
                fileName: 'email.gif',
                description: `Il est possible d'exporter un dessin soit dans le format JPG ou PNG et l'envoyer par courriel à une adresse.
                            Avant l'exportation, il est possible d'appliquer un filtre au dessin et de définir son intensité sur l'image via le panneau latéral droit.
                            Un seul filtre peut être appliqué à la fois.
                            ${NEW_LINE}Il faut également donner un nom à l'image à exporter. Dans le cas écheant, le bouton Envoyer sera désactivé.
                            ${NEW_LINE}Le raccourci clavier vers la fenêtre d'exportation est <span class="keyboard-key">Ctrl + E</span>.
                            ${NEW_LINE}Il suffit de cliquer sur le bouton de Envoyer pour exporter le dessin par courriel.`,
            },
        ],
    },
    {
        title: 'Exporter un dessin',
        number: '03',
        sections: [
            {
                fileTitle: "Démonstration de l'exportation d'un dessin",
                fileName: 'exportation.gif',
                description: `Il est possible d'exporter un dessin soit dans le format JPG ou PNG localement dans les téléchargements.
                            Avant l'exportation, il est possible d'appliquer un filtre au dessin et de définir son intensité sur l'image via le panneau latéral droit.
                            Un seul filtre peut être appliqué à la fois. Il faut également donner un nom à l'image à exporter.
                          ${NEW_LINE}Le raccourci clavier vers la fenêtre d'exportation est <span class="keyboard-key">Ctrl + E</span>.
                          ${NEW_LINE}Il suffit de cliquer sur le bouton de confirmation pour exporter le dessin.`,
            },
        ],
    },
    {
        title: "Point d'entrée",
        number: '04',
        sections: [
            {
                fileTitle: "La page d'accueil de TS Paint",
                fileName: 'entry_point.png',
                description: `À l'atterissage sur TS Paint, vous serez présenté avec une interface contenant plusieurs composantes.
                        ${NEW_LINE}Commençant par le haut, à gauche se trouve le nom de notre application et à droite, le lien vers notre <a href="https://gitlab.com/polytechnique-montr-al/log2990/20203/equipe-201/log2990-201" class="guide-github-link" target="_blank">GitLab</a>.
                        ${NEW_LINE}Au milieu, vous avez plusieurs options entre Créer un nouveau dessin, Ouvrir le carrousel de dessin, Afficher le guide d'utilisateur et Continuer un dessin.
                        ${NEW_LINE}Finalement, en bas, il y a le nom de tous les membres de notre merveilleuse équipe TS Paint.`,
            },
        ],
    },
    {
        title: 'Sauvegarde',
        subtitle: [
            {
                title: 'Sauvegarde sur serveur',
                number: '05',
                sections: [
                    {
                        fileTitle: 'Démonstration de la sauvegarde manuelle',
                        fileName: 'sauvegardeManuelle.gif',
                        description: `Il est possible de sauvegarder un dessin sur le serveur en format PNG.
                                      On doit obligatoirement fournir un nom au dessin à sauvegarder, mais il n'a pas à être unique.
                                      Il est possible d'ajouter ou pas des étiquettes soit des mots ou des expressions permettant d'identifier le dessin.
                                    ${NEW_LINE}Le raccourci clavier vers la fenêtre de sauvegarde est <span class="keyboard-key">Ctrl + S</span>.`,
                    },
                ],
            },
            {
                title: 'Sauvegarde automatique',
                number: '05',
                sections: [
                    {
                        fileTitle: 'Démonstration de la sauvegarde automatique',
                        fileName: 'automatic_save.gif',
                        description: `Lorsque l'utilisateur est en train de dessiner, chaque action executée sur la surface du dessin est sauvegardée automatiquement sans aucune intervention.
                                    ${NEW_LINE}Le dessin de l'utilisateur est sauvegardé lors
                                    <ul>
                                        <li>De la création d'un nouveau dessin</li>
                                        <li>Du chargement d'un dessin via le carrousel de dessins</li>
                                        <li>D'une modification quelconque sur la surface de dessin</li>
                                    </ul>`,
                    },
                ],
            },
        ],
    },
];
