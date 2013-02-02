<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="xlink"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:mml="http://www.w3.org/1998/Math/MathML"
  xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes" standalone="yes" indent="yes"/>

  <!-- body of the article -->
  <xsl:template match="/">
    <article itemscope="itemscope" itemtype="scholarlyarticle">
      <xsl:apply-templates select="article/front"/>
      <xsl:apply-templates select="article/body"/>
      <xsl:apply-templates select="article/back"/>
      <xsl:apply-templates select="article/floats-group"/>
    </article>
  </xsl:template>

  <xsl:template match="front">
    <header class="{local-name()}">
      <xsl:apply-templates select="article-meta/title-group/article-title"/>

      <div class="context authors" itemprop="authors" data-ignore-class="">
        <xsl:apply-templates select="article-meta/contrib-group/contrib[@contrib-type='author']/name"/>
      </div>

      <p class="context event" data-ignore-class="">
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

        <a>
          <xsl:attribute name="href">
            <xsl:text>http://dx.doi.org/</xsl:text>
            <xsl:value-of select="article-meta/article-id[@pub-id-type='doi']"/>
          </xsl:attribute>

          <time itemprop="datePublished">
            <xsl:value-of select="$date/year"/>
            <xsl:if test="$date/month">-<xsl:value-of select="format-number($date/month, '00')"/></xsl:if>
            <xsl:if test="$date/day">-<xsl:value-of select="format-number($date/day, '00')"/></xsl:if>
          </time>
        </a>

        <xsl:text> · </xsl:text>

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
      </p>
    </header>
  </xsl:template>

  <!--
  <xsl:template name="toc">
    <ol class="toc">
      <xsl:for-each select="sec">
          <li>
            <xsl:choose>
              <xsl:when test="@id">
                <a href="#{@id}"><xsl:apply-templates select="title/node()"/></a>
              </xsl:when>
              <xsl:otherwise>
                <span><xsl:apply-templates select="title/node()"/></span>
              </xsl:otherwise>
            </xsl:choose>
            <xsl:call-template name="toc"/>
          </li>
      </xsl:for-each>
    </ol>
  </xsl:template>
-->

  <xsl:template match="body">
    <main class="{local-name()}" lang="en">
      <nav>
        <!--<xsl:call-template name="toc"/>-->
      </nav>
      
      <xsl:apply-templates select="node()|@*"/>
    </main>
  </xsl:template>

  <!-- back -->
  <xsl:template match="back">
    <footer class="{local-name()}">
      <xsl:apply-templates select="@*"/>
      <xsl:apply-templates select="ref-list"/>
    </footer>
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

  <!-- the article title -->
  <xsl:template match="article-title">
    <h1 class="{local-name()}"><xsl:apply-templates select="node()|@*"/></h1>
  </xsl:template>

  <!-- people -->
  <xsl:template match="person-group">
    <div class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </div>
  </xsl:template>

  <!-- name -->
  <xsl:template name="name">
    <xsl:apply-templates select="given-names"/>
    <xsl:if test="surname">
      <xsl:text> </xsl:text>
      <xsl:apply-templates select="surname"/>
    </xsl:if>
  </xsl:template>

  <!-- name -->
  <xsl:template match="name">
    <span class="{local-name()}">
      <xsl:call-template name="name"/>
    </span>
    <xsl:if test="not(position() = last())">, </xsl:if>
  </xsl:template>

  <!-- style elements -->
  <xsl:template match="italic | bold | sc | strike | sub | sup | underline | inline-formula">
    <span class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </span>
  </xsl:template>

  <!-- inline elements -->
  <xsl:template match="abbrev | surname | given-names | email | label | year | month | day | xref | contrib | source | volume | fpage | lpage | etal | pub-id | named-content | funding-source | award-id | x">
    <span class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </span>
  </xsl:template>

  <!-- table elements -->
  <xsl:template match="table | tbody | thead | tfoot | column | tr | th | td | colgroup | col">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </xsl:element>
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

  <xsl:template match="supplementary-material/caption/title">
    <section class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </section>
  </xsl:template>

  <xsl:template match="sec[@sec-type='additional-information']/title">
    <h2><xsl:apply-templates select="node()|@*"/></h2>
  </xsl:template>

  <!-- links -->
  <xsl:template match="ext-link">
    <a class="{local-name()}" href="{@xlink:href}">
      <xsl:apply-templates select="node()|@*"/>
    </a>
  </xsl:template>

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
    <a class="{local-name()} bibr" href="{$url}" rel="tooltip" target="_new" data-rid="{@rid}"><cite itemscope="itemscope" itemref="{@rid}"><xsl:apply-templates select="node()|@*"/></cite></a>
  </xsl:template>

  <!-- cross-referenced reference -->
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

  <!-- definition list -->
  <xsl:template match="def-list">
    <dl class="{local-name()}">
      <xsl:apply-templates match="node()|@*"/>
    </dl>
  </xsl:template>

  <xsl:template match="def-item">
    <xsl:apply-templates match="term"/>
    <xsl:apply-templates match="def"/>
  </xsl:template>

  <xsl:template match="def-item/term">
    <dt class="{local-name()}">
      <xsl:apply-templates match="node()|@*"/>
    </dt>
  </xsl:template>

  <xsl:template match="def-item/def">
    <dd class="{local-name()}">
      <xsl:apply-templates match="node()|@*"/>
    </dd>
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
    <li class="{local-name()}" itemid="{@id}">
      <xsl:apply-templates select="mixed-citation | citation | element-citation|@*"/>
    </li>
  </xsl:template>

  <!-- mixed citation -->
  <xsl:template match="mixed-citation | citation | element-citation">
    <xsl:apply-templates select="../label"/>

    <xsl:apply-templates select="article-title"/>

    <xsl:choose>
      <xsl:when test="person-group">
        <xsl:apply-templates select="person-group"/>
      </xsl:when>
      <xsl:otherwise>
        <div class="person-group" data-ignore-class="">
          <xsl:apply-templates select="name"/>
        </div>
      </xsl:otherwise>
    </xsl:choose>

    <xsl:apply-templates select="year"/>

    <xsl:apply-templates select="source"/>
  </xsl:template>

  <!-- article title in references -->
  <xsl:template match="mixed-citation/article-title|citation/article-title|element-citation/article-title">
    <a class="{local-name()}" target="_blank" href="http://scholar.google.com/scholar?q=intitle:&quot;{.}&quot;"><xsl:apply-templates select="node()|@*"/></a>
  </xsl:template>

  <!-- "et al" -->
  <xsl:template match="person-group/etal">
    <span class="{local-name()}">et al.</span>
  </xsl:template>

  <!-- block elements -->
  <xsl:template match="*">
    <div class="{local-name()}">
      <xsl:apply-templates select="node()|@*"/>
    </div>
  </xsl:template>

  <!-- id attribute (direct copy) -->
  <xsl:template match="@id | @colspan">
    <xsl:copy-of select="."/>
  </xsl:template>

  <!-- attributes (ignore) -->
  <xsl:template match="@*"></xsl:template>

  <!-- ignore namespaced attributes -->
  <xsl:template match="@*[namespace-uri()]"></xsl:template>

  <!-- mathml (direct copy) -->
  <xsl:template match="mml:math">
    <xsl:copy-of select="."/>
  </xsl:template>
</xsl:stylesheet>
