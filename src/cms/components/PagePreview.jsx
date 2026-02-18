import {getAdminHref, normalize} from '../utils.js';
import navigation from "../../settings/navigation.json";

export const PagePreview = window.createClass({
  render: function() {
    const { entry, widgetFor, getAsset } = this.props;
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

    const allLinks = navigation.links.flatMap(link => [
      link,
      ...(link.sublinks || [])
    ]);

    const currentLink = allLinks.find(link => normalize(link.href) === normalizedCurrentPath);
    const pageTitle = currentLink?.title || entry.getIn(['data', 'title']) || "Praxis mit Herz";
    const headerImage = currentLink?.header_img || '/images/Header_Startseite.jpg';

    // Breadcrumbs
    let breadcrumbs = [];
    for (const link of navigation.links) {
      if (normalize(link.href) === normalizedCurrentPath) {
        breadcrumbs.push({ label: link.label, href: link.href });
        break;
      }
      if (link.sublinks) {
        const sublink = link.sublinks.find(s => normalize(s.href) === normalizedCurrentPath);
        if (sublink) {
          breadcrumbs.push({ label: link.label, href: link.href });
          breadcrumbs.push({ label: sublink.label, href: sublink.href });
          break;
        }
      }
    }

    const h = window.h;

    return h('div', { lang: 'de' },
      h('div', { id: 'top', className: 'mac chrome blink ch143' },
        h('input', { type: 'checkbox', id: 'menu', className: 'mobile-check' },),
        h('label', { for: 'menu', className: 'button-nav-mobile' },),
        h('div', { className: 'outer-wrapper' },
          h('div', { className: 'inner-wrapper' },
            // Header
            h('header', { id: 'header' },
              h('div', { className: 'inside' },
                h('div', { className: 'innerwrapper' },
                  h('div', { className: 'logo' },
                    h('div', {},
                      h('a', { href: getAdminHref('/'), title: 'Startseite' },
                        h('img', { src: '/images/logo.png', alt: 'Logo Heilpraktikerin Simone Schulz' })
                      )
                    )
                  )
                ),
                h('div', { className: 'mod_article headerimage block' },
                  h('div', { className: 'ce_gallery block' },
                    h('ul', {},
                      h('li', { style: { backgroundImage: `url(${getAsset(headerImage)})`, height: '300px', backgroundSize: 'cover', backgroundPosition: 'center' } })
                    )
                  )
                ),
                h('div', { className: 'placeholder' }),
                h('div', { className: 'nav-wrapper' },
                  h('nav', { className: 'mod_navigation nav_main block' },
                    h('ul', { className: 'level_1' },
                      navigation.links.filter(l => l.show_in_header !== false).map(l => {
                        const isActive = normalize(l.href) === normalizedCurrentPath;
                        const isSubActive = l.sublinks?.some(s => normalize(s.href) === normalizedCurrentPath);
                        return h('li', { className: 'submenu' },
                          isActive ? h('span', { className: 'active' }, l.label) : h('a', { href: getAdminHref(l.href), className: isSubActive ? 'trail' : '' }, l.label),
                          l.sublinks && l.sublinks.length > 0 && h('ul', { className: 'level_2' },
                            l.sublinks.filter(s => s.show_in_header !== false).map(s => {
                              const isSubActive = normalize(s.href) === normalizedCurrentPath;
                              return h('li', {},
                                isSubActive ? h('span', { className: 'active' }, s.label) : h('a', { href: getAdminHref(s.href) }, s.label)
                              );
                            })
                          )
                        );
                      })
                    )
                  )
                ),
                h('nav', { className: 'mod_breadcrumb block' },
                  h('ul', {},
                    h('li', { className: 'first' }, h('a', { href: getAdminHref('/') }, 'Heilpraktikerin Simone Schulz Frankfurt')),
                    breadcrumbs.map((crumb, index) =>
                      h('li', { className: index === breadcrumbs.length - 1 ? "active last" : "" },
                        index === breadcrumbs.length - 1 ? crumb.label : h('a', { href: getAdminHref(crumb.href) }, crumb.label)
                      )
                    )
                  )
                )
              )
            ),
            // Main Content
            h('div', { id: 'wrapper' },
              h('div', { id: 'container' },
                h('div', { id: 'main' },
                  widgetFor('body')
                )
              )
            )
          ),
          // Footer
          h('footer', { id: 'footer' },
            h('div', { className: 'inside' },
              h('nav', { className: 'mod_navigation nav_meta block' },
                h('ul', { className: 'level_1' },
                  h('li', { className: 'first' }, h('a', { href: getAdminHref('/impressum') }, 'Impressum')),
                  h('li', { className: 'last' }, h('a', { href: getAdminHref('/datenschutz') }, 'Datenschutz'))
                )
              ),
              h('div', { className: 'footer-content' },
                h('div', { className: 'mod_article block' },
                  h('div', { className: 'ce_text grid2 block' },
                    h('h4', {}, 'Heilpraktikerin Simone Schulz'),
                    h('p', {}, 'Seckbacher Landstr. 74', h('br'), 'Erdgeschoss links', h('br'), '60389 Frankfurt'),
                    h('p', {}, 'Nußallee 7', h('br'), 'Gebäude C / 2. OG', h('br'), '63450 Hanau'),
                    h('p', {}, 'Telefon: ', h('a', { href: 'tel:+491601536183' }, '01601536183'), h('br'), 'Email: ', h('a', { href: 'mailto:info@praxismitherz.net' }, 'info@praxismitherz.net'))
                  ),
                  h('div', { className: 'ce_text grid1 block' },
                    h('div', { style: { width: '97px', height: '145px', margin: '15px 25px', backgroundImage: 'url(https://cdn1.jameda-elements.de/premium/widgets/_images/bw-small-bg.png)', backgroundRepeat: 'no-repeat' } })
                  ),
                  h('div', { className: 'ce_text grid1 block' },
                    h('p', { style: { textAlign: 'right' } },
                      h('a', { href: getAdminHref('/über-mich') },
                        h('img', { src: '/images/7dd71608-63bd-4a32-a2c6-fb56540f7826.jpg', alt: 'Heilpraktikerin Simone Schulz, Frankfurt', width: '150' })
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