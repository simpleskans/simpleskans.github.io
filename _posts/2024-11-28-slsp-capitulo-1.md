---
layout: padrao
title: "[S2] Enfrente a Escuridão"
descricao: 'Tradução do Capítulo 01 do Smash Pass de Smash Legends para português'
categories: smash-legends
tags: slsp neve rainha-bruxa chapeuzinho
permalink: /:categories/:title
resumo: 'Capítulo 1 | Smash Pass'
capa: '/img/postcapa/slsp1.png'
autorL: 'Season 2'
csscustomizado: <link rel="stylesheet" href="/css/webtoon.css" />
numero: 1
---

<article>
    <div class="topowebtoon">
        <figure>
        <img src="{{ page.capa }}" alt="Capa de {{ page.title }}" style="object-position: center 10%;" />
        </figure>
        <h1>{{ page.title }}</h1>
        <span>{{ page.resumo }}</span>
        
        <div class="localpostagem">
            <i class="bi bi-tags-fill"></i>
            {% assign c = page.categories %} {% for a in c %}
            <a href="{{ site.url }}/{{ a }}/" class="categoriapost"
                >{{ a | replace: '-', ' ' | replace: 'rom', 'ROM' | replace: 'dnd', 'Dungeons &#38; Dragons' }} </a
            ><span>, </span>
            {% endfor %}
            <br />
            <i class="bi bi-clock-fill"></i> {{ page.date | date: "%d/%m/%Y"}}
        </div>
    </div>
    <div class="corpo">
        <div class="ladoE">
           {% include capnavsp.html %} 
           <div class="separador"></div>
            <section class="galeriawebtoon">
                <figure>
                    <img loading="lazy" src="https://i.imgur.com/OSiAXQE.png" alt="{{ page.resumo }} - Página 1" />
                </figure>
                <figure>
                    <img loading="lazy" src="https://i.imgur.com/URx2lz7.png" alt="{{ page.resumo }} - Página 2" />
                </figure>
            </section>
            <div class="separador"></div>
            {% include capnav.html %} 
        </div>
        <div class="outros lateralcaps">
            <h6>Capítulos Recentes</h6>
            <nav class="outrosposts">
                {% assign c = site.tags.slsp | slice: 0, 10 %}
                 {% for post in c %} 
                 {% unless post.title == page.title %}
                <a href="{{ post.url }}">
                    <figure style="background-image: url({{ post.capa }})"></figure>
                    {{ post.title }}
                </a>
                {% endunless %}
                {% endfor %}
            </nav>
            <div class="separador"></div>
            <div class="redeslateral menulateralrapido">
                <p>Compartilhe o post:</p>
                {% include compartilhar.html %}
            </div>
        </div>
    </div>
</article>
<div class="corpo corpo2">
    <div>
        <div class="separador"></div>

        <section class="comentarios">
            <h5 class="secaotitulo" id="secao5"><i class="bi bi-chat-dots-fill"></i> Comentários</h5>
            <div id="disqus_thread"></div>
            <script>
                /**
                 *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
                 *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */

                var disqus_config = function () {
                    this.page.url = "{{ site.url }}{{ page.url }}"; // Replace PAGE_URL with your page's canonical URL variable
                    this.page.identifier = "{{ page.url }}"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
                };
                (function () {
                    // DON'T EDIT BELOW THIS LINE
                    var d = document,
                        s = d.createElement("script");
                    s.src = "https://simple-skans.disqus.com/embed.js";
                    s.setAttribute("data-timestamp", +new Date());
                    (d.head || d.body).appendChild(s);
                })();
            </script>
            <noscript
                >Please enable JavaScript to view the
                <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript
            >
        </section>
    </div>

    <div class="outros">
        <div class="separador"></div>
        <h6>Outros Posts</h6>
        <nav class="outrosposts">
            {% assign c = site.posts | slice: 0, 8 %} {% for post in c %} {% unless post.title == page.title %}
            <a href="{{ post.url }}">
                <figure style="background-image: url({{ post.capa }})"></figure>
                {{ post.title }}
            </a>
            {% endunless %} {% endfor %}
        </nav>
    </div>
</div>
