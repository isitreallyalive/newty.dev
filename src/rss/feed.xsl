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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width" />
        <title>newty.dev</title>
        <link
          href="https://api.fonts.coollabs.io/css2?family=Cascadia+Code&amp;family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&amp;display=swap"
          rel="stylesheet"
        />
        <link href="/rss/feed.css" rel="stylesheet" />
      </head>
      <body
        class="bg-background text-foreground flex min-h-screen flex-col sm:text-lg"
      >
        <div
          class="mx-auto my-8 flex max-w-xs flex-col lg:max-w-3xl xl:max-w-5xl"
        >
          <!-- src/components/nav/Nav.astro -->
          <nav class="flex items-center justify-between select-none">
            <div class="flex items-center gap-4 font-mono text-xl">
              <!-- src/components/nav/Cat.astro -->
              <button
                class="relative font-mono text-sm font-bold -tracking-[0.125em] transition-colors select-none hover:cursor-pointer hover:brightness-125 sm:text-base"
              >
                <div>/\_/\</div>
                <div>
                  ( o.o )
                </div>
                <div>&gt; ^ &lt;</div>
              </button>

              <div class="flex gap-1">
                <a href="/" class="hover:text-accent font-semibold">newt</a>
                <span>/</span>
                <span class="text-muted-foreground">rss.xml</span>
              </div>
            </div>
          </nav>
          <main>
            <div
              class="border-accent shadow-lg bg-ctp-base/40 mt-8 mb-10 flex w-full flex-col rounded-xl border p-4 sm:p-6"
            >
              <div class="has-icon select-none">
                <xsl:for-each select="document('/rss/rss.svg')/*">
                  <xsl:copy>
                    <xsl:copy-of select="@*"/>
                    <xsl:attribute name="class">fill-current h-9</xsl:attribute>
                    <xsl:copy-of select="node()"/>
                  </xsl:copy>
                </xsl:for-each>
                <h1 class="text-2xl sm:text-3xl">This is an RSS feed</h1>
              </div>

              <p class="select-none">
                To subscribe to this feed, add this URL to your RSS reader:
                <code><xsl:value-of select="/rss/channel/link" />rss.xml</code>
              </p>
            </div>

            <!-- posts -->
            <xsl:for-each select="/rss/channel/item">
              <div class="flex items-center justify-between gap-4">
                <a class="flex items-center gap-8 group max-w-fit">
                  <xsl:attribute name="href">
                    <xsl:value-of select="link" />
                  </xsl:attribute>
                  <!-- date -->
                  <span class="text-muted-foreground font-mono flex-none w-auto whitespace-nowrap">
                    <xsl:value-of select="substring(pubDateISO, 1, 4)" /> · <xsl:value-of select="substring(pubDateISO, 6, 2)" />  · <xsl:value-of select="substring(pubDateISO, 9, 2)" />
                  </span>
                  <!-- title -->
                  <h2 class="text-xl sm:text-2xl group-hover:text-accent">
                    <xsl:value-of select="title" />
                  </h2>
                </a>
                <div class="has-icon select-none text-muted-foreground flex-none">
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
                <hr class="border-foreground/50 my-6 rounded-full border-t-2" />
              </xsl:if>
            </xsl:for-each>
          </main>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>