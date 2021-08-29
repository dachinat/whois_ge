require "whois-parser"

class Api::DomainsController < Api::ApplicationController
  def check_multi
    whois = Whois::Client.new

    @list = domain_params[:list]

    @response = {}
    @list.each do |domain|
      next unless domain.present?

      begin
        record = whois.lookup(domain)
      rescue => e
        next
      end

      parser = record.parser

      @response[domain] = {
        domain: domain,
        available: parser.available?,
        details: {
          created_on: parser.created_on,
          expires_on: parser.expires_on,
          registrar: parser.registrar,
          registrant_contacts: parser.registrant_contacts,
          admin_contacts: parser.admin_contacts,
          technical_contacts: parser.technical_contacts,
          nameservers: parser.nameservers
        }
      }
    end

    render json: @response
  end

  def domain_params
    params.require(:domain).permit(list: [])
  end
end