<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="xlink"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:mml="http://www.w3.org/1998/Math/MathML"
  xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes" standalone="yes" indent="yes"/>

  <xsl:variable name="doi" select="article/front/article-meta/article-id[@pub-id-type='doi']"/>

  <!-- body of the article -->
  <xsl:template match="/">
    <article itemscope="itemscope" itemtype="scholarlyarticle">
      <xsl:apply-templates select="article/front"/>
      <xsl:apply-templates select="article/body"/>
      <xsl:apply-templates select="article/back"/>
      <xsl:apply-templates select="article/floats-group"/>
    </article>
  </xsl:template>

  <!-- style elements -->
  <xsl:template match="sc | strike | monospace | overline | roman | sans-serif">
    <span class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </span>
  </xsl:template>

  <!-- inline elements -->
  <xsl:template match="surname | given-names | email | label | year | month | day | contrib | source | volume | fpage | lpage | etal | pub-id | named-content | funding-source | award-id | inline-formula | x">
    <span class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </span>
  </xsl:template>

  <!-- front -->
  <xsl:template match="front">
    <header class="{local-name()}">
      <xsl:apply-templates select="article-meta/title-group/article-title"/>

      <div class="context authors" itemprop="authors" data-ignore-class="">
        <xsl:apply-templates select="article-meta/contrib-group/contrib[@contrib-type='author']/name"/>
      </div>

      <p class="context event" data-ignore-class="">
        <xsl:call-template name="canonical"/>
        <xsl:text> · </xsl:text>
        <xsl:call-template name="provider"/>
      </p>
    </header>
  </xsl:template>

  <!-- canonical URL, publication date -->
  <xsl:template name="canonical">
    <a rel="canonical" href="http://dx.doi.org/{$doi}">
      <xsl:call-template name="publication-date"/>
    </a>
  </xsl:template>

  <!-- publication date -->
  <xsl:template name="publication-date">
    <xsl:variable name="datetype">
      <xsl:choose>
        <xsl:when test="article-meta/pub-date[@pub-type='epub']">
          <xsl:copy-of select="'epub'"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:copy-of select="'ppub'"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="date" select="article-meta/pub-date[@pub-type=$datetype]"/>

    <time itemprop="datePublished">
      <xsl:value-of select="$date/year"/>
      <xsl:if test="$date/month">-<xsl:value-of select="format-number($date/month, '00')"/></xsl:if>
      <xsl:if test="$date/day">-<xsl:value-of select="format-number($date/day, '00')"/></xsl:if>
    </time>
  </xsl:template>

  <!-- provider -->
  <xsl:template name="provider">
    <i itemprop="provider">
      <xsl:choose>
        <xsl:when test="journal-meta/journal-title-group">
          <xsl:value-of select="journal-meta/journal-title-group/journal-title"/>
        </xsl:when>
        <xsl:when test="journal-meta/journal-title">
          <xsl:value-of select="journal-meta/journal-title"/>
        </xsl:when>
        <xsl:when test="journal-meta/journal-id[@journal-id-type='nlm-ta']">
          <xsl:value-of select="journal-meta/journal-id[@journal-id-type='nlm-ta']"/>
        </xsl:when>
      </xsl:choose>
    </i>
  </xsl:template>

  <!-- the article title -->
  <xsl:template match="article-title">
    <h1 class="{local-name()}"><xsl:apply-templates select="node()|@*"/></h1>
  </xsl:template>

  <!-- people -->
  <xsl:template match="person-group">
    <div class="{local-name()}">
      <xsl:apply-templates select="@*"/>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- name -->
  <xsl:template match="name">
    <xsl:param name="itemprop"/>

    <xsl:call-template name="comma-separator"/>

    <span class="{local-name()}">
      <xsl:if test="string-length($itemprop)">
        <xsl:attribute name="itemprop">
          <xsl:value-of select="$itemprop"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:call-template name="name"/>
    </span>
  </xsl:template>

  <!-- name (named template) -->
  <xsl:template name="name">
    <xsl:apply-templates select="given-names"/>
    <xsl:if test="surname">
      <xsl:text> </xsl:text>
      <xsl:apply-templates select="surname"/>
    </xsl:if>
  </xsl:template>

  <!-- body -->
  <xsl:template match="body">
    <main class="{local-name()}" lang="en">
      <xsl:apply-templates select="@*"/>
      <nav> </nav>
      <xsl:apply-templates select="node()"/>
    </main>
  </xsl:template>

  <!-- sections -->
  <xsl:template match="sec">
    <section class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </section>
  </xsl:template>

  <!-- section headings -->
  <xsl:template match="title | fig/label | table-wrap/label">
    <xsl:variable name="hierarchy" select="count(ancestor::sec | ancestor::back | ancestor::fig | ancestor::table-wrap)"/>

    <xsl:if test="$hierarchy > 4">
      <xsl:variable name="hierarchy">6</xsl:variable>
    </xsl:if>

    <xsl:variable name="heading">h<xsl:value-of select="$hierarchy + 1"/></xsl:variable>

    <xsl:element name="{$heading}">
      <xsl:attribute name="class">heading</xsl:attribute>
      <xsl:attribute name="data-ignore-class"></xsl:attribute>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:element>
  </xsl:template>

  <!-- "additional information" title -->
  <xsl:template match="sec[@sec-type='additional-information']/title">
    <h2><xsl:apply-templates select="node()|@*"/></h2>
  </xsl:template>

  <!-- table elements -->
  <xsl:template match="table | tbody | thead | tfoot | column | tr | th | td | colgroup | col">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </xsl:element>
  </xsl:template>

  <!-- ordered list -->
  <xsl:template match="list[@list-type='order']">
    <ol class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </ol>
  </xsl:template>

  <!-- unordered list -->
  <xsl:template match="list">
    <ul class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </ul>
  </xsl:template>

  <!-- list item -->
  <xsl:template match="list-item">
    <li class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </li>
  </xsl:template>

  <!-- paragraph -->
  <xsl:template match="p">
    <p class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </p>
  </xsl:template>

  <!-- abbreviation -->
  <xsl:template match="abbrev">
    <abbr class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </abbr>
  </xsl:template>

  <!-- supplementary material title -->
  <xsl:template match="supplementary-material/caption/title">
    <section class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </section>
  </xsl:template>

  <!-- links -->
  <xsl:template match="ext-link">
    <a class="{local-name()}" href="{@xlink:href}">
      <xsl:apply-templates select="node()|@*"/>
    </a>
  </xsl:template>

  <!-- DOI -->
  <xsl:template match="ext-link[@ext-link-type='doi']">
    <a class="{local-name()}" href="http://dx.doi.org/{@xlink:href}">
      <xsl:apply-templates select="node()|@*"/>
    </a>
  </xsl:template>

  <!-- cross-reference -->
  <xsl:template match="xref">
    <a class="{local-name()}" href="#{@rid}" data-rid="{@rid}"><xsl:apply-templates select="node()|@*"/></a>
  </xsl:template>

  <!-- cross-reference -->
  <xsl:template match="xref[@ref-type='bibr']">
    <xsl:variable name="rid" select="@rid"/>
    <xsl:variable name="ref" select="/article/back/ref-list/ref[@id=$rid]"/>
    <xsl:variable name="url">
      <xsl:call-template name="reference-url">
        <xsl:with-param name="ref" select="$ref"/>
      </xsl:call-template>
    </xsl:variable>
    <a class="{local-name()} bibr" href="{$url}" rel="tooltip" data-rid="{@rid}"><xsl:apply-templates select="node()|@*"/></a>
  </xsl:template>

  <!-- figure -->
  <xsl:template match="fig">
    <figure class="{local-name()}">
      <xsl:apply-templates select="@*"/>

      <div class="image-container">
        <xsl:apply-templates select="graphic" mode="fig"/>
      </div>

      <figcaption>
        <xsl:apply-templates select="label"/>
        <xsl:apply-templates select="caption"/>
      </figcaption>

      <xsl:apply-templates select="p"/>
    </figure>
  </xsl:template>

  <!-- figure title -->
  <xsl:template match="title" mode="fig">
    <div class="{local-name()}"><xsl:apply-templates select="node()|@*"/></div>
  </xsl:template>

  <!-- graphic -->
  <xsl:template match="graphic | inline-graphic">
    <xsl:variable name="href" select="@xlink:href"/>
    <img class="{local-name()}" data-src="{$href}"><xsl:apply-templates select="@*"/></img>
  </xsl:template>

  <!-- figure graphic -->
  <xsl:template match="graphic" mode="fig">
    <xsl:variable name="href" select="@xlink:href"/>
    <img class="{local-name()}" data-src="{$href}"><xsl:apply-templates select="@*"/></img>
  </xsl:template>

  <!-- uri -->
  <xsl:template match="uri">
    <a class="{local-name()}" href="{@xlink:href}">
      <xsl:apply-templates select="@*|node()"/>
    </a>
  </xsl:template>

  <!-- ordered list -->
  <xsl:template match="ordered-list">
    <ol class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </ol>
  </xsl:template>

  <!-- unordered list -->
  <xsl:template match="list">
    <ul class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </ul>
  </xsl:template>

  <xsl:template match="list-item">
    <li class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </li>
  </xsl:template>

  <xsl:template match="list/list-item/label"/>

  <!-- definition list -->
  <xsl:template match="def-list">
    <dl class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </dl>
  </xsl:template>

  <xsl:template match="def-item">
    <xsl:apply-templates select="term"/>
    <xsl:apply-templates select="def"/>
  </xsl:template>

  <xsl:template match="def-item/term">
    <dt class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </dt>
  </xsl:template>

  <xsl:template match="def-item/def">
    <dd class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </dd>
  </xsl:template>

  <!-- formatting -->
  <xsl:template match="italic">
    <i>
      <xsl:apply-templates select="node()|@*"/>
    </i>
  </xsl:template>

  <xsl:template match="bold">
    <b>
      <xsl:apply-templates select="node()|@*"/>
    </b>
  </xsl:template>

  <xsl:template match="sub">
    <sub>
      <xsl:apply-templates select="node()|@*"/>
    </sub>
  </xsl:template>

  <xsl:template match="sup">
    <sup>
      <xsl:apply-templates select="node()|@*"/>
    </sup>
  </xsl:template>

  <xsl:template match="underline">
    <u>
      <xsl:apply-templates select="node()|@*"/>
    </u>
  </xsl:template>

  <xsl:template match="preformat[@preformat-type='code']">
    <pre>
      <xsl:apply-templates select="@*"/>
      <code>
        <xsl:apply-templates select="node()"/>
      </code>
    </pre>
  </xsl:template>

  <xsl:template match="preformat">
    <pre>
      <xsl:apply-templates select="node()|@*"/>
    </pre>
  </xsl:template>

  <xsl:template match="break">
    <br/>
  </xsl:template>

  <xsl:template match="hr">
    <hr/>
  </xsl:template>

  <!-- supplementary material -->
  <xsl:template match="supplementary-material">
    <div class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
      <a href="{@xlink:href}" download="" class="btn">Download</a>
    </div>
  </xsl:template>

  <!-- acknowledgments -->
  <xsl:template match="ack">
    <section class="{local-name()}">
      <xsl:apply-templates select="@*"/>
      <xsl:if test="not(title)">
        <h2 class="heading">Acknowledgments</h2>
      </xsl:if>
      <xsl:apply-templates select="node()"/>
    </section>
  </xsl:template>

  <!-- aside -->
  <xsl:template match="boxed-text">
    <aside class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </aside>
  </xsl:template>

  <!-- blockquote -->
  <xsl:template match="disp-quote">
    <blockquote class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </blockquote>
  </xsl:template>

  <!-- back -->
  <xsl:template match="back">
    <footer class="{local-name()}">
      <xsl:apply-templates select="@*"/>
      <xsl:apply-templates select="ref-list"/>
    </footer>
  </xsl:template>

  <!-- reference url (named template) -->
  <xsl:template name="reference-url">
    <xsl:param name="ref"/>
    <xsl:variable name="doi" select="$ref//pub-id[@pub-id-type='doi']"/>
    <xsl:variable name="pmid" select="$ref//pub-id[@pub-id-type='pmid']"/>
    <xsl:choose>
      <xsl:when test="$doi">
        <xsl:value-of select="concat('http://dx.doi.org/', $doi)"/>
      </xsl:when>
      <xsl:when test="$pmid">
        <xsl:value-of select="concat('http://pubmed.gov/', $pmid)"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="concat('#', @id)"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- reference list -->
  <xsl:template match="ref-list">
    <xsl:apply-templates select="title|@*"/>
    <div class="ref-list-container" data-ignore-class="">
      <ul class="{local-name()}">
        <xsl:apply-templates select="ref|@*"/>
      </ul>
    </div>
  </xsl:template>

  <!-- reference list item -->
  <xsl:template match="ref-list/ref">
    <li class="{local-name()}" id="{@id}" itemscope="itemscope" itemprop="citation">
      <xsl:variable name="type" select="*/@publication-type"/>

      <xsl:choose>
        <xsl:when test="$type = 'journal'">
          <xsl:attribute name="itemtype">http://schema.org/ScholarlyArticle</xsl:attribute>
        </xsl:when>
        <xsl:when test="$type = 'book'">
          <xsl:attribute name="itemtype">http://schema.org/Book</xsl:attribute>
        </xsl:when>
      </xsl:choose>

      <xsl:apply-templates select="mixed-citation | citation | element-citation|@*"/>
    </li>
  </xsl:template>

  <!-- mixed citation -->
  <xsl:template match="mixed-citation | citation | element-citation">
    <xsl:apply-templates select="../label"/>

    <xsl:apply-templates select="article-title"/>

    <xsl:if test="descendant::name">
      <div class="person-group" data-ignore-class="">
        <xsl:apply-templates select="descendant::name">
          <xsl:with-param name="itemprop" select="'author'"/>
        </xsl:apply-templates>
      </div>
    </xsl:if>

    <xsl:apply-templates select="year" mode="citation"/>

    <xsl:apply-templates select="source"/>

    <xsl:apply-templates select="comment"/>

    <xsl:call-template name="altmetric"/>
  </xsl:template>

  <!-- citation year -->
  <xsl:template match="year" mode="citation">
    <span class="year" itemprop="datePublished">
      <xsl:choose>
        <xsl:when test="@iso-8601-date">
          <xsl:value-of select="@iso-8601-date"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates/>
        </xsl:otherwise>
      </xsl:choose>
    </span>
  </xsl:template>

  <!-- article title in citation -->
  <xsl:template match="mixed-citation/article-title|citation/article-title|element-citation/article-title">
    <xsl:variable name="doi" select="../pub-id[@pub-id-type='doi']"/>
    <xsl:variable name="pmid" select="../pub-id[@pub-id-type='pmid']"/>

    <xsl:variable name="url">
      <xsl:choose>
        <xsl:when test="$doi">
          <xsl:value-of select="concat('http://dx.doi.org/', $doi)"/>
        </xsl:when>
        <xsl:when test="$pmid">
          <xsl:value-of select="concat('http://pubmed.gov/', $pmid)"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:variable name="author">
            <xsl:value-of select="../descendant::name[1]/surname"/>
          </xsl:variable>
          <xsl:value-of select="concat('http://scholar.google.com/scholar?q=intitle:&quot;', ., '&quot;%20inauthor:&quot;', $author, '&quot;')"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <cite>
      <a class="{local-name()}" target="_blank" href="{$url}" itemprop="url">
        <xsl:apply-templates select="node()|@*"/>
      </a>
    </cite>
  </xsl:template>

  <!-- "et al" -->
  <xsl:template match="person-group/etal">
    <xsl:call-template name="comma-separator"/>
    <span class="{local-name()}">et al.</span>
  </xsl:template>

  <!-- altmetric -->
  <xsl:template name="altmetric">
    <xsl:variable name="doi" select="pub-id[@pub-id-type='doi']"/>
    <xsl:variable name="pmid" select="pub-id[@pub-id-type='pmid']"/>
    <xsl:choose>
      <xsl:when test="$doi">
        <div class="altmetric-embed" data-badge-popover="left" data-doi="{$doi}"></div>
      </xsl:when>
      <xsl:when test="$pmid">
        <div class="altmetric-embed" data-badge-popover="left" data-pmid="{$pmid}"></div>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <!-- block elements -->
  <xsl:template match="*">
    <div class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </div>
  </xsl:template>

  <!-- alternatives -->
  <xsl:template match="alternatives">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="alternatives/graphic"/>
  <xsl:template match="alternatives/inline-graphic"/>


  <!-- id attribute (direct copy) -->
  <xsl:template match="@id | @colspan | @rowspan | @align">
    <xsl:copy-of select="."/>
  </xsl:template>

  <!-- abbrev/@alt -> abbr/@title -->
  <xsl:template match="abbrev/@alt">
    <xsl:attribute name="title">
      <xsl:value-of select="."/>
    </xsl:attribute>
  </xsl:template>

  <!-- attributes (ignore) -->
  <xsl:template match="@*"></xsl:template>

  <!-- ignore namespaced attributes -->
  <xsl:template match="@*[namespace-uri()]"></xsl:template>

  <!-- mathml root element -->
  <xsl:template match="mml:math">
      <math xmlns="http://www.w3.org/1998/Math/MathML">
          <xsl:copy-of select="@*"/>
          <xsl:apply-templates mode="mathml"/>
      </math>
  </xsl:template>

  <!-- mathml (direct copy) -->
  <xsl:template match="*" mode="mathml">
      <xsl:element name="{local-name()}" xmlns="http://www.w3.org/1998/Math/MathML">
          <xsl:copy-of select="@*"/>
          <xsl:apply-templates mode="mathml"/>
      </xsl:element>
      <!--<xsl:copy-of select="."/>-->
  </xsl:template>

  <!-- TeX math -->
  <xsl:template match="tex-math"/>

  <!-- comma separator -->
  <xsl:template name="comma-separator">
    <xsl:param name="separator" select="', '"/>
    <xsl:if test="position() != 1">
      <xsl:value-of select="$separator"/>
    </xsl:if>
  </xsl:template>

  <!-- sub-article -->
  <xsl:template match="sub-article"/>

</xsl:stylesheet>
