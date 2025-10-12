# Paste this script and run it in your terminal.
# It generates culture pages with paragraphs in both languages.

# CONFIGURATION: Set your language color
LANGUAGE = "spanish"  # Options: "spanish" or "french"

# Color schemes
COLORS = {
    "spanish": {
        "primary": "#DD1F25",
        "dark": "#AA151B",
        "back_link": "../../spanish-culture.html"
    },
    "french": {
        "primary": "#0055A4",
        "dark": "#003D7A",
        "back_link": "../../french-culture.html"
    }
}

page_title = "La Tomatina"

page_content = """
(tomatina-banner.jpg)

La Tomatina is one of Spain's most famous festivals, held annually in the small town of Buñol, near Valencia. Every year on the last Wednesday of August, thousands of people from around the world gather to participate in the world's biggest food fight.

La Tomatina es uno de los festivales más famosos de España, que se celebra anualmente en el pequeño pueblo de Buñol, cerca de Valencia. Cada año, el último miércoles de agosto, miles de personas de todo el mundo se reúnen para participar en la pelea de comida más grande del mundo.

(tomatina-crowd.jpg)

The festival begins at 11 AM when a water cannon signals the start. Trucks loaded with over 150,000 tomatoes enter the town square, and participants begin throwing tomatoes at each other. The battle lasts for about one hour, creating rivers of tomato juice flowing through the streets.

El festival comienza a las 11 de la mañana cuando un cañón de agua señala el inicio. Camiones cargados con más de 150,000 tomates entran en la plaza del pueblo, y los participantes comienzan a lanzarse tomates unos a otros. La batalla dura aproximadamente una hora, creando ríos de jugo de tomate que fluyen por las calles.

The origins of La Tomatina are unclear, but the most popular story dates back to 1945 when young people started a food fight during a parade. The tradition was banned for several years but was eventually accepted and has grown into the massive celebration it is today.

Los orígenes de La Tomatina no están claros, pero la historia más popular se remonta a 1945 cuando los jóvenes comenzaron una pelea de comida durante un desfile. La tradición fue prohibida durante varios años, pero finalmente fue aceptada y ha crecido hasta convertirse en la celebración masiva que es hoy.

(tomatina-cleanup.jpg)

After the tomato fight ends, fire trucks spray down the streets and participants. The acidity of the tomatoes actually leaves the streets cleaner than before! Participants often head to the nearby pool or showers to clean up before celebrating in local bars and restaurants.

Después de que termina la pelea de tomates, los camiones de bomberos rocían las calles y los participantes. ¡La acidez de los tomates en realidad deja las calles más limpias que antes! Los participantes a menudo se dirigen a la piscina cercana o a las duchas para limpiarse antes de celebrar en bares y restaurantes locales.
"""


def parse_culture_content(content_txt):
    lines = [l.strip() for l in content_txt.split('\n') if l.strip()]
    i = 0
    blocks = []
    first_image = None

    while i < len(lines):
        if lines[i].startswith('(') and lines[i].endswith(')'):
            img_path = lines[i][1:-1].strip()
            if not first_image:
                first_image = img_path
            blocks.append(('img', img_path))
            i += 1
        else:
            # Get English paragraph
            english_para = lines[i]
            i += 1

            # Get target language paragraph
            target_para = ''
            if i < len(lines) and not lines[i].startswith('('):
                target_para = lines[i]
                i += 1

            blocks.append(('text', english_para, target_para))

    return blocks, first_image


def culture_to_html(title, blocks, banner_image, language="spanish"):
    colors = COLORS[language]
    primary_color = colors["primary"]
    dark_color = colors["dark"]
    back_link = colors["back_link"]

    lang_name = "Spanish" if language == "spanish" else "French"
    default_view = "english"  # Default to showing English first

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: Georgia, 'Times New Roman', serif;
            background: #f5f5f5; 
            color: #2a2a2a;
            line-height: 1.8;
        }}

        /* Navigation Bar */
        .navbar {{
            background-color: {primary_color};
            height: 65px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }}
        .back-button {{
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            padding: 8px 18px;
            border-radius: 6px;
            transition: all 0.3s ease;
            background-color: rgba(255, 255, 255, 0.1);
        }}
        .back-button:hover {{
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateX(-5px);
        }}
        .back-arrow {{ font-size: 1.3rem; }}

        /* Toggle Container */
        .toggle-container {{
            display: flex;
            align-items: center;
            gap: 12px;
        }}
        .toggle-label {{ color: white; font-size: 0.95rem; font-weight: 400; }}
        .toggle-switch {{
            position: relative;
            width: 55px;
            height: 28px;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 30px;
            cursor: pointer;
            transition: background-color 0.3s;
        }}
        .toggle-switch.active {{ background-color: rgba(255, 255, 255, 0.5); }}
        .toggle-slider {{
            position: absolute;
            top: 3px;
            left: 3px;
            width: 22px;
            height: 22px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }}
        .toggle-switch.active .toggle-slider {{ transform: translateX(27px); }}

        /* Hero Banner */
        .hero-banner {{
            position: relative;
            width: 100%;
            height: 320px;
            background-image: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('{banner_image}');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 50px;
        }}
        .page-title {{
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
            font-size: 3.5rem;
            font-weight: 400;
            color: white;
            text-align: center;
            text-shadow: 0 4px 12px rgba(0,0,0,0.4);
            letter-spacing: 1px;
        }}

        /* Content */
        .container {{ 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px 30px 60px 30px; 
        }}
        .content-block {{ 
            margin-bottom: 2.5em;
            position: relative;
        }}
        .paragraph {{ 
            font-size: 1.15rem;
            font-weight: 400;
            color: #1a1a1a;
            line-height: 1.9;
            margin-bottom: 12px;
        }}
        .paragraph.translation {{
            display: none;
            padding-left: 20px;
            border-left: 3px solid {primary_color};
            color: #555;
            font-style: italic;
        }}
        .paragraph.translation.show {{
            display: block;
        }}
        .translate-btn {{
            display: inline-block;
            margin-top: 8px;
            font-size: 0.7rem;
            color: {primary_color};
            background: transparent;
            border: 1px solid {primary_color};
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 600;
            opacity: 0.7;
            letter-spacing: 0.5px;
        }}
        .translate-btn:hover {{
            opacity: 1;
            background: {primary_color};
            color: white;
        }}
        .content-image {{ 
            display: block; 
            margin: 3em auto; 
            max-width: 100%; 
            height: auto;
            border-radius: 8px; 
            box-shadow: 0 6px 24px rgba(0,0,0,0.12); 
        }}

        @media (max-width: 768px) {{
            .navbar {{ height: 60px; padding: 0 20px; }}
            .hero-banner {{ height: 250px; }}
            .page-title {{ font-size: 2.5rem; }}
            .container {{ padding: 20px 20px 50px 20px; }}
            .paragraph {{ font-size: 1.05rem; }}
        }}
    </style>
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <a href="{back_link}" class="back-button">
            <span class="back-arrow">←</span>
            <span>Back</span>
        </a>
        <div class="toggle-container">
            <span class="toggle-label" id="toggleLabel">View in {lang_name}</span>
            <div class="toggle-switch" id="toggleSwitch" onclick="toggleAllTranslations()">
                <div class="toggle-slider"></div>
            </div>
        </div>
    </nav>

    <!-- Hero Banner with Page Title -->
    <div class="hero-banner">
        <h1 class="page-title">{title}</h1>
    </div>

    <!-- Page Content -->
    <div class="container">
"""

    para_id = 0
    for block in blocks:
        if block[0] == 'img':
            html += f'        <img src="{block[1]}" class="content-image" alt="Culture illustration">\n'
        else:
            html += f"""        <div class="content-block">
            <p class="paragraph main" id="main-{para_id}">{block[1]}</p>
            <p class="paragraph translation" id="trans-{para_id}">{block[2]}</p>
            <button class="translate-btn" id="btn-{para_id}" onclick="toggleTranslation({para_id})">TRANSLATE</button>
        </div>
"""
            para_id += 1

    html += f"""    </div>

    <script>
        let viewMode = 'english'; // 'english' or 'target'
        const langName = '{lang_name}';
        const totalParagraphs = {para_id};

        function toggleTranslation(id) {{
            const translation = document.getElementById('trans-' + id);
            const btn = document.getElementById('btn-' + id);

            if (translation.classList.contains('show')) {{
                translation.classList.remove('show');
                if (viewMode === 'english') {{
                    btn.textContent = 'TRANSLATE';
                }} else {{
                    btn.textContent = 'SHOW ENGLISH';
                }}
            }} else {{
                translation.classList.add('show');
                btn.textContent = 'HIDE';
            }}
        }}

        function toggleAllTranslations() {{
            const toggle = document.getElementById('toggleSwitch');
            const toggleLabel = document.getElementById('toggleLabel');

            viewMode = viewMode === 'english' ? 'target' : 'english';
            toggle.classList.toggle('active');

            // Swap content for all paragraphs
            for (let i = 0; i < totalParagraphs; i++) {{
                const mainPara = document.getElementById('main-' + i);
                const transPara = document.getElementById('trans-' + i);
                const btn = document.getElementById('btn-' + i);

                // Swap the text content
                const temp = mainPara.textContent;
                mainPara.textContent = transPara.textContent;
                transPara.textContent = temp;

                // Hide translation and reset button
                transPara.classList.remove('show');

                if (viewMode === 'target') {{
                    btn.textContent = 'SHOW ENGLISH';
                    toggleLabel.textContent = 'View in English';
                }} else {{
                    btn.textContent = 'TRANSLATE';
                    toggleLabel.textContent = 'View in ' + langName;
                }}
            }}
        }}
    </script>
</body>
</html>"""
    return html


if __name__ == "__main__":
    blocks, banner_image = parse_culture_content(page_content)
    html = culture_to_html(page_title, blocks, banner_image if banner_image else 'placeholder.jpg', language=LANGUAGE)
    # Print to stdout (copy-paste into your HTML file)
    print(html)
    # Or write to a file (uncomment below)
    # with open("index.html", "w", encoding="utf-8") as f:
    #     f.write(html)