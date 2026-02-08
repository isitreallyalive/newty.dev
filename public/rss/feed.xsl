<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet
  version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
        <title>newt / rss.xml</title>
        <link href="/rss/rss.css" rel="stylesheet" />
      </head>
      <body>
        <!-- src/components/nav/Navbar.astro -->
        <nav class="prose container flex items-center select-none gap-8">
          <!-- src/components/nav/Cat.astro -->
          <button
            class="relative font-mono text-sm font-bold -tracking-[0.125em] transition-colors select-none hover:cursor-pointer hover:brightness-125 sm:text-base md:text-lg"
          >
            <div>/\_/\</div>
            <div>
              ( o.o )
            </div>
            <div>&gt; ^ &lt;</div>
          </button>

          <div class="flex flex-col">
            <div class="prose-headings:my-0">
              <h2 class="font-mono!">
                <a href="/" class="no-underline font-bold hover:text-accent">newt</a>
                <span class="text-muted-foreground"> / rss.xml</span>
              </h2>
            </div>

            <ul class="not-prose flex gap-4 text-lg">
              <li><a class="hover:text-accent text-foreground transition-colors duration-300" href="/projects">projects</a></li>
              <li><a class="hover:text-accent text-foreground transition-colors duration-300" href="/blog">writing</a></li>
              <li><a class="hover:text-accent text-foreground transition-colors duration-300" href="/friends">friends</a></li>
            </ul>
          </div>
        </nav>

        <main class="container pt-0!">
          <!-- rss disclaimer -->
          <div class="select-none shadow-lg gap-1 bg-crust mt-8 mb-10 flex w-full flex-col rounded-xl p-6">
            <h1 class="flex items-center gap-1">
              <xsl:for-each select="document('/rss/rss.svg')/*">
                <xsl:copy>
                  <xsl:copy-of select="@*"/>
                  <xsl:attribute name="class">fill-current size-[1em]</xsl:attribute>
                  <xsl:copy-of select="node()"/>
                </xsl:copy>
              </xsl:for-each>
              This is an RSS feed
            </h1>

            <p class="mb-0!">
              To subscribe to this feed, add this URL to your RSS reader:
              <code class="select-text"><xsl:value-of select="/rss/channel/link" />rss.xml</code>
            </p>
          </div>

          <!-- posts -->
          <xsl:for-each select="/rss/channel/item">
            <div class="flex justify-between select-none">
              <a class="no-underline group prose-headings:my-0!">
                <xsl:attribute name="href">
                  <xsl:value-of select="link" />
                </xsl:attribute>

                <!-- date -->
                <span class="text-muted-foreground font-mono flex-none w-auto whitespace-nowrap">
                  <xsl:value-of select="substring(pubDateISO, 1, 4)" /> · <xsl:value-of select="substring(pubDateISO, 6, 2)" />  · <xsl:value-of select="substring(pubDateISO, 9, 2)" />
                </span>

                <!-- title -->
                <h2 class="group-hover:text-accent! transition-colors">
                  <xsl:value-of select="title" />
                </h2>
              </a>

              <!-- reading time -->
              <div class="text-muted-foreground flex gap-1 items-center">
                <xsl:for-each select="document('/rss/clock-outline.svg')/*">
                  <xsl:copy>
                    <xsl:copy-of select="@*"/>
                    <xsl:attribute name="class">fill-current h-6</xsl:attribute>
                    <xsl:copy-of select="node()"/>
                  </xsl:copy>
                </xsl:for-each>
                <span>
                  <xsl:value-of select="readingTime" />
                </span>
              </div>
            </div>

            <!-- divider -->
            <xsl:if test="position() != last()">
              <hr />
            </xsl:if>
          </xsl:for-each>
        </main>

        <!-- footer -->
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>