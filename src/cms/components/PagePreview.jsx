import {getAdminHref, normalize} from '../utils.js';
import navigation from "../../settings/navigation.json";
import settings from "../../settings/site-settings.json";
import { marked } from "marked";

export const PagePreview = window.createClass({
  render: function () {
    const {entry, widgetFor, getAsset} = this.props;
    const slug = entry.getIn(['data', 'slug']) || '';
    const collection = entry.get('collection');

    // Construct href based on collection and slug
    let currentHref = '';
    if (collection === 'page') {
      currentHref = slug === 'index' ? '/' : (slug.startsWith('/') ? slug : '/' + slug);
    } else {
      currentHref = `/${collection}/${slug}`;
    }
    const normalizedCurrentPath = normalize(currentHref);

    const allLinks = navigation.links.flatMap(link => [link, ...(link.sublinks || [])]);

    const currentLink = allLinks.find(link => normalize(link.href) === normalizedCurrentPath);
    const pageTitle = currentLink?.title || entry.getIn(['data', 'title']) || "Praxis mit Herz";
    const headerImage = currentLink?.header || '/admin/uploads/Header_Startseite.jpg';

    // Breadcrumbs
    let breadcrumbs = [];
    for (const link of navigation.links) {
      if (normalize(link.href) === normalizedCurrentPath) {
        breadcrumbs.push({label: link.label, href: link.href});
        break;
      }
      if (link.sublinks) {
        const sublink = link.sublinks.find(s => normalize(s.href) === normalizedCurrentPath);
        if (sublink) {
          breadcrumbs.push({label: link.label, href: link.href});
          breadcrumbs.push({label: sublink.label, href: sublink.href});
          break;
        }
      }
    }

    const h = window.h;

    return h('div', {lang: 'de'},
      h('div', {id: 'top', className: 'mac chrome blink ch143'},
        h('input', {type: 'checkbox', id: 'menu', className: 'mobile-check'},),
        h('label', {for: 'menu', className: 'button-nav-mobile'},),
        h('div', {className: 'outer-wrapper'},
          h('div', {className: 'inner-wrapper'},
            // Header
            h('header', {id: 'header'},
              h('div', {className: 'inside'},
                h('div', {className: 'innerwrapper'},
                  h('div', {className: 'logo'},
                    h('div', {},
                      h('a', {href: getAdminHref('/'), title: 'Startseite'},
                        h('img', {
                          src: getAsset(settings.logo),
                          alt: 'Logo Heilpraktikerin Simone Schulz'
                        })
                      )
                    )
                  )
                ),
                h('div', {className: 'mod_article headerimage block'},
                  h('div', {className: 'ce_gallery block'},
                    h('ul', {},
                      h('li', {
                        style: {
                          backgroundImage: `url(${getAsset(headerImage)})`,
                          height: '300px',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }
                      })
                    )
                  )
                ),
                h('div', {className: 'placeholder'}),
                h('div', {className: 'nav-wrapper'},
                  h('nav', {className: 'mod_navigation nav_main block'},
                    h('ul', {className: 'level_1'},
                      navigation.links.filter(l => l.show_in_header !== false).map(l => {
                        const isActive = normalize(l.href) === normalizedCurrentPath;
                        const isSubActive = l.sublinks?.some(s => normalize(s.href) === normalizedCurrentPath);
                        return h('li', {className: 'submenu'},
                          isActive ? h('span', {className: 'active'}, l.label) : h('a', {
                            href: getAdminHref(l.href),
                            className: isSubActive ? 'trail' : ''
                          }, l.label),
                          l.sublinks && l.sublinks.length > 0 && h('ul', {className: 'level_2'},
                            l.sublinks.filter(s => s.show_in_header !== false).map(s => {
                              const isSubActive = normalize(s.href) === normalizedCurrentPath;
                              return h('li', {},
                                isSubActive ? h('span', {className: 'active'}, s.label) : h('a', {href: getAdminHref(s.href)}, s.label)
                              );
                            })
                          )
                        );
                      })
                    )
                  )
                ),
                h('nav', {className: 'mod_breadcrumb block'},
                  h('ul', {},
                    h('li', {className: 'first'}, h('a', {href: getAdminHref('/')}, 'Heilpraktikerin Simone Schulz Frankfurt')),
                    breadcrumbs.map((crumb, index) =>
                      h('li', {className: index === breadcrumbs.length - 1 ? "active last" : ""},
                        index === breadcrumbs.length - 1 ? crumb.label : h('a', {href: getAdminHref(crumb.href)}, crumb.label)
                      )
                    )
                  )
                )
              )
            ),
            // Main Content
            h('div', {id: 'wrapper'},
              h('div', {id: 'container'},
                h('main', {id: 'main'},
                  widgetFor('body')
                )
              )
            )
          ),
          // Footer
          h('footer', {id: 'footer'},
            h('div', {className: 'inside'},
              h('nav', {className: 'mod_navigation nav_meta block'},
                h('ul', {className: 'level_1'},
                  h('li', {className: 'first'}, h('a', {href: getAdminHref('/impressum')}, 'Impressum')),
                  h('li', {className: 'last'}, h('a', {href: getAdminHref('/datenschutz')}, 'Datenschutz'))
                )
              ),
              h('div', {className: 'footer-content'},
                h('div', {className: 'mod_article block'},
                  h('div', {
                    className: 'ce_text grid2 block',
                    dangerouslySetInnerHTML: { __html: marked.parse(settings.footerText || '') }
                  }),
                  h('div', {className: 'ce_text grid2 block'},
                    h('p', {style: {textAlign: 'right'}},
                      h('a', {href: getAdminHref(settings.footerImageHref)},
                        h('img', {
                          src: getAsset(settings.footerImage),
                          alt: settings.footerImageAlt,
                          width: settings.footerImageWidth
                        })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});